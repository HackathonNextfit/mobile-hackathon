import {Image, StyleSheet} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {HelloWave} from '@/components/HelloWave';
import {useRef, useState} from 'react';
import {VStack, Button, HStack, Input} from 'native-base';
import {setRefreshToken, setToken} from '@/api';
import {token} from '@/api/services/auth';
import usuarioService from '@/api/services/usuario';
import enumService from '@/api/services/enum';
import {setStorageEnum} from '@/enums/utils';
import {setAmbienteUsuario} from '@/hooks/useAmbienteUsuario/util';
import perfilAcessoService from '@/api/services/perfilAcesso';
import {setPermissoes} from '@/hooks/usePermission/util';
import _ from 'lodash';

export default function LoginScreen() {

    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [email, setEmail] = useState('usuariohackaton@nextfit.com.br');
    const [password, setPassword] = useState('123456a');
    const [codigoTenant, setCodigoTenant] = useState('7');
    const [codigoUnidade, setCodigoUnidade] = useState('7');
    const codigoUsuario = useRef(0);

    const recuperarPermissoes = async () => {
        try {
            const {Content} = await perfilAcessoService.recuperarPermissoesUsuarioLogado();
            const permissoes: any = _.map(Content, (currentValue: any) => {
                const permissao: any = {};
                permissao[currentValue.Permissao] = true;
                permissao.isPermitido = currentValue.Permitido;
                return permissao;
            });
            setPermissoes(permissoes);
            setLoadingLogin(false);
        } catch (error) {
            alert('Erro ao recuperar permissões');
        }
    };

    const recuperarAmbiente = async () => {
        try {
            const {Content} = await usuarioService.recuperarAmbienteUsuario(codigoUsuario.current);
            setAmbienteUsuario(Content);
            await recuperarPermissoes();
        } catch (error) {
            alert('Erro ao recuperar ambiente');
        }
    };

    const atualizarEnums = async () => {
        try {
            const {Content} = await enumService.recuperarTodos();
            const newEnums: any = {Enums: {}};
            _.forEach(Content.Enums, (r: any) => {
                if (!r.Nome) return;
                newEnums.Enums[r.Nome] = r.Itens;
            });
            setStorageEnum(newEnums);
            await recuperarAmbiente();
        } catch (error) {
            alert('Erro ao atualizar enums ERRO:' + JSON.stringify(error));
        }
    };

    const recuperarUsuario = async () => {
        try {
            const {Content} = await usuarioService.recuperarUsuarioLogado();
            codigoUsuario.current = Content?.Id;
            await atualizarEnums();
        } catch (error) {
            alert('Erro ao recuperar usuario');
        }
    };

    const onClickLogin = async () => {
        if (!email || !password || !codigoTenant || !codigoUnidade) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            setLoadingLogin(true);
            const retorno = await token({
                username: email,
                password: password,
                codigoTenant: Number(codigoTenant),
                codigoUnidade: Number(codigoUnidade),
            });
            setToken(retorno.access_token);
            setRefreshToken(retorno.refresh_token);
            await recuperarUsuario();
        } catch (error: any) {
            setLoadingLogin(false);
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#A1CEDC', dark: '#142125'}}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>

            <ThemedView style={styles.titleContainer}>
                <VStack width='full' space={3}>
                    <HStack space={2}>
                        <ThemedText type="title">Login!</ThemedText>
                        <HelloWave/>
                    </HStack>

                    <Input value={email} placeholder="Email" onChangeText={(text) => setEmail(text)}/>
                    <Input value={password} type='password' placeholder="Senha"
                           onChangeText={(text) => setPassword(text)}/>
                    <Input value={codigoTenant} placeholder="Código Tenant"
                           onChangeText={(text) => setCodigoTenant(text)}/>
                    <Input value={codigoUnidade} placeholder="Código Unidade"
                           onChangeText={(text) => setCodigoUnidade(text)}/>

                    <Button width='full' isLoading={loadingLogin} isLoadingText='Realizando login...'
                            onPress={onClickLogin}>
                        ENTRAR
                    </Button>

                </VStack>
            </ThemedView>

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
