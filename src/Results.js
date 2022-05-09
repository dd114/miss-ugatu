import React, {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    View,
    Panel,
    AdaptivityProvider,
    AppRoot,
    ConfigProvider,
    SplitLayout,
    SplitCol,
    Root,
    Epic, TabbarItem, Tabbar, Cell, Avatar
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import fireStore from "./DB";


const Results = () => {

    const [rating, setRating] = useState([])

    useEffect(() => {
        const ref = query(collection(fireStore, 'users'), orderBy('bestScore'), limit(100))
        // const q = query(collection(db, "cities"), where("capital", "==", true));

        getDocs(ref).then(async (docs) => {
            let tempIdArray = []
            docs.forEach(e => tempIdArray.push(e.id))

            const data = await bridge.send("VKWebAppCallAPIMethod", {
                "method": "users.get",
                "request_id": "32test",
                "params": {
                    "user_ids": tempIdArray.join(','),
                    "v": "5.131",
                    "fields": "photo_100",
                    "access_token": "43d622264f5270475b941c24bc117d252490fe0d97ef581ec7b44321cb1f3df7aa970bf00bc50d4e641db"
                }
            });

            let tempArray = []
            docs.forEach(e => tempArray.push({
                ...e.data(),
                avatar: data.response.find(v => v.id.toString() === e.id).photo_100
            }))
            setRating(tempArray)
            console.log(tempArray)

        });


    }, [])

    return (
        <React.Fragment>
            {rating.map(
                (v, i) => <Cell key={i} before={<Avatar src={v.avatar}></Avatar>}
                                after={'Total: ' + v.bestScore}>{v.Name + ' ' + v.Surname}</Cell>
            )}
        </React.Fragment>
    )
}

export default Results