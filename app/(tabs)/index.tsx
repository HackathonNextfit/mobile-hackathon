import {Image, StyleSheet} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {HelloWave} from '@/components/HelloWave';
import {useEffect, useRef, useState} from 'react';
import {Text, Spinner, VStack, Button, HStack} from 'native-base';
import {setRefreshToken, setToken} from '@/api';
import {token} from '@/api/services/auth';
import usuarioService from '@/api/services/usuario';
import enumService from '@/api/services/enum';
import {getEnum, setStorageEnum} from '@/enums/utils';
import {setAmbienteUsuario} from '@/hooks/useAmbienteUsuario/util';
import perfilAcessoService from '@/api/services/perfilAcesso';
import {setPermissoes} from '@/hooks/usePermission/util';
import _ from 'lodash';
import useAmbienteUsuario from '@/hooks/useAmbienteUsuario';
import usePermission from '@/hooks/usePermission';

export default function HomeScreen() {

    const {recuperarUsuarioLogado} = useAmbienteUsuario()

    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [email] = useState('usuariohackaton@nextfit.com.br');
    const [password] = useState('123456a');
    const [codigoTenant] = useState('7');
    const [codigoUnidade] = useState('7');
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

    const tiposDeTreino = getEnum('EnumTipoTreino');
    const {possuiPermissao} = usePermission();

    const temPermissaoVisualizarCadastroDeCliente = possuiPermissao('ClientesCadastrar');

    const ambienteUsuario = recuperarUsuarioLogado();
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

                    <Button width='full' isLoading={loadingLogin} isLoadingText='Realizando login...' onPress={onClickLogin}>
                        Realizar login fixo
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
