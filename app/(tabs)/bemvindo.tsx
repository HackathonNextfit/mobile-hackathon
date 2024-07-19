import {Image, StyleSheet} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {HelloWave} from '@/components/HelloWave';
import {VStack, HStack, Text} from 'native-base';
import {getEnum} from '@/enums/utils';
import usePermission from '@/hooks/usePermission';
import useAmbienteUsuario from '@/hooks/useAmbienteUsuario';

export default function BemVindo() {

    const {recuperarUsuarioLogado} = useAmbienteUsuario()
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
                <VStack space={3}>
                    <HStack space={2}>
                        <ThemedText type="title">Bem vindo!</ThemedText>
                        <HelloWave/>
                    </HStack>
                    <HStack mt={4}>
                        <ThemedText type="title">Exemplos:</ThemedText>
                    </HStack>

                    <Text>
                        Tipos de treinos : {JSON.stringify(tiposDeTreino?.map(tipo => tipo.Identificador))}
                    </Text>
                    <Text>
                        Meu usuário possui permissão para cadastrar
                        clientes? {temPermissaoVisualizarCadastroDeCliente ? 'Sim' : 'Não'}
                    </Text>
                    <Text>
                        Ambiente do usuário: {JSON.stringify(ambienteUsuario)}
                    </Text>
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
