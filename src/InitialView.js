import React, {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    View,
    Panel,
    AdaptivityProvider,
    AppRoot,
    ConfigProvider,
    SplitLayout,
    Epic, TabbarItem, Tabbar
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import App from './App'
import {Icon24GameOutline, Icon28NewsfeedOutline} from "@vkontakte/icons";
import Results from "./Results";


const InitialView = () => {



    const [activePanel, setActivePanel] = useState('game')

    const onStoryChange = (e) => {
        setActivePanel(e.currentTarget.dataset.story)
    }

/*
    const [scheme, setScheme] = useState('light')
    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                console.log('data.scheme', data.scheme.split('_')[1])
                setScheme(data.scheme.split('_')[1])
            }
        });

    }, []);
*/

    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout>

                        <Epic
                            activeStory={activePanel}
                            tabbar={

                                <Tabbar>
                                    <TabbarItem

                                        onClick={onStoryChange}
                                        selected={activePanel === "game"}
                                        data-story="game"
                                        text="Game"
                                    >
                                        <Icon24GameOutline/>
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activePanel === "results"}
                                        data-story="results"
                                        text="Top"
                                    >
                                        <Icon28NewsfeedOutline/>
                                    </TabbarItem>
                                </Tabbar>

                            }
                        >

                            <View id={'game'} activePanel={'game'}>
                                <Panel id={'game'}>
                                    <App/>
                                </Panel>
                            </View>

                            <View id={'results'} activePanel={'results'}>
                                <Panel id={'results'}>

                                    <Results/>

                                </Panel>
                            </View>

                        </Epic>


                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}

export default InitialView