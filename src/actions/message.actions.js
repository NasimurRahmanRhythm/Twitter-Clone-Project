import axios from "axios";


export const messageActions = {
    ADD_MESSAGES: (state, {message, room}) => {
        let roomMessages = state.messages[room]?.data;
        if(!roomMessages) roomMessages = [];
        roomMessages.unshift(message);
        return (currentState) => {
            if(!currentState.messages[room]) {
                currentState.messages[room] = {data: []};
            }
            currentState.messages[room].data = roomMessages;
            return {...currentState};
        }
    },

    SEND_MESSAGES: async(_, {message, room}, dispatch) => {
        const customId = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
        await dispatch(messageActions.ADD_MESSAGES, {
            message: {
                ...message,
                _id: customId
            },
            room: room,
        });
        const {data: response } = await axios.post('/api/message', {
            ...message,
            customId,
        });

        await dispatch(messageActions.DELIVERED_MESSAGES, response.data);
        return (state) => state;
    },

    DELIVERED_MESSAGES : (state, {message, customId}) => {
        const currentState = {...state};
        const messages = currentState.messages[message.receiver]?.data;
        if(messages){
            for(let i=0;i<messages.length;i++)
            {
                if(messages[i]._id === customId)
                {
                    messages[i]=message;
                    break;
                }
            }
        }

        return state =>{
            state.messages[message.receiver].data = messages;
            return {...state};
        }
    },

    SEEN_MESSAGES: async (state, userId) => {
        const currentState = {...state};
        const messages = currentState.messages[userId]?.data;
        if(messages && messages.length > 0)
        {
            for(let i=0;i<messages.length;i++)
            {
                if(messages[i].seen) break;
                messages[i].seen = true;
            }
        }
        return newState;
    },

    ADD_USER_MESSAGES: (state, {userId, messages }) => {
        const currentState = {...state};
        if(!currentState.message[userId]){
            currentState.messages[userId] = {data: [], isLastPage: false, pageIndex: 1};
        }

        currentState.messages[userId].data = [
            ...currentState.messages[userId].data,
            ...messages,
        ];
        return currentState;
    },

    SET_USER_MESSAGES: (_, {userId,messages})=>{
        return (state)=>{
            state.messages[userId]={
                data:messages,
                isLastPage: messages && messages.length<50,
                pageIndex:1,
            };
            return {...state};
        };
    },
    
    FETCH_USER_MESSEGES: async (state, {userId,pageSize=50}, dispatch) => {
        if(state.messages[userId]?.isLastPage){
            return state;
        }
        try {
            const{data:response} = await axios.post(`/api/conversation/?pageIndex=${state.messages[userId].pageIndex+1}&pageSize=${pageSize}`,{
                userId: state.session.user?._id,
                receiver:userId,
            });
            state = await dispatch(messageActions.ADD_USER_MESSAGES, {
                messages: response.data,
                userId,
            });
            if(response.data && response.data.length < 50){
                state.messages[userId].isLastPage = true;
            }
            state.messages[userId].pageIndex++;
            return {...state};
        } catch (error) {
            return state;
        }
    },

    CLEAR_USER_NOTIFICATIONS: (state, userId)=>{
        const currentState = {...state};
        currentState.messageNotifications?.delete(userId);
        return currentState;
    },

    FETCH_MESSAGE_NOTIFICATIONS: async ()=>{
        let {data:notifications} = await axios.get('/api/notification?type=message');
        return (state)=>({
            ...state,
            messageNotifications: new Set(notifications.data),
        });
    },

    ADD_MESSAGE_NOTIFICATIONS: (state, {message,room})=>{
        const messageNotifications = state.messageNotifications;
        if(message.sender !== room){
            messageNotifications.add(message.sender);
        }
        else{
            state.socket?.emit("see_message", message);
        }
        return (currentState) => {
            currentState.messageNotifications = messageNotifications;
            return {...currentState};
        };
    },

    SET_USERS: (_,users) => {
        return (state) => ({...state, users: users, chatUsers: users});
    },

    SET_ROOM: (_,room)=>{
        return (state)=>({...state,room});
    },

    SET_SOCKET: (_,socket)=> {
        return (state)=> ({...state, socket});
    }

}