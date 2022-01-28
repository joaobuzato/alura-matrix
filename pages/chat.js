import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';

import { ButtonSendSticker  } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM2OTE0NywiZXhwIjoxOTU4OTQ1MTQ3fQ.2XAdeOQBGTHIw2umq9vY9IaKpPNTxtRC9ozDdq1IGPk'
const SUPABASE_URL = 'https://pqvqinegffwylyrxfmzl.supabase.co'
const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY)

function realTime(adicionaMensagem) {
    return supabaseClient
        .from('Mensagem')
        .on('INSERT', (msg) => {
            adicionaMensagem(msg.new);
        })
            .subscribe();
        
}

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('')
    const [listaMensagens, setListaMensagens] = React.useState([])
    const router = useRouter();
    const user = router.query.username;



    React.useEffect(() =>{
        supabaseClient
        .from('Mensagem')
        .select('*')
        .order('id', { ascending:false} )
        .then((dados) => {
            setListaMensagens(dados.data)
        });

        realTime((novaMensagem) => {
            setListaMensagens( (listaAtual) => {
            return [
                novaMensagem,
                ...listaAtual
            ]})
        })
    }, [] );
    
    
    function handleNewMessage(novaMensagem) {
        const mensagem = {
            texto: novaMensagem,
            de: user
        }
        supabaseClient
            .from('Mensagem')
            .insert([mensagem])
            .then(({ data }) => {
                
            })
        setMensagem('')
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/earthrise.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaMensagens} /> 


                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem} 
                            onChange={(event)=> {
                                setMensagem(event.target.value)
                            }}
                            onKeyPress={(event) =>{
                                if(event.key === 'Enter'){
                                    event.preventDefault()
                                    handleNewMessage(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                        onStickerClick={(sticker) => {
                            handleNewMessage(`:sticker: ${sticker}`)
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem)=> {
                return (
                    <Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >
                <Box
                    styleSheet={{
                        marginBottom: '8px',
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                    />
                    <Text tag="strong">
                        {mensagem.de}
                    </Text>
                    <Text
                        styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                {mensagem.texto.startsWith(':sticker:')
                ? (
                    <Image src={mensagem.texto.replace(':sticker:', '')} />
                ) : (
                    mensagem.texto
                )}
            </Text>
                )
                })}
            
        </Box>
    )
}