import { AcceptInvitation } from "@/actions/acceptInvitation";
import { DeclineInvitation } from "@/actions/declineInvitation";
import { GetInvitations } from "@/actions/getInvitation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  ref,
  update,
  get,
  query,
  equalTo,
  orderByKey,
  startAt,
  endAt,
  onChildAdded,
  onValue,
  off,
  remove,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";
import { realtimedb } from "@/lib/firebaseclient";
import { Message } from "@/components/Messages/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { getTalentById } from "@/utils/airtable/airtable.service";
import { GetClientById } from "@/actions/getClientById";
import { GetAccountInformation } from "@/actions/getAccountInformation";
import { useRouter } from "next/router";

type user = {
  name: string;
  avatar: string;
};

export default function Home() {
  const { airtable_id, accountType, setDataLoading } = useParticipantStore(
    (state) => state
  );

  const [rooms, setRooms] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState<any>();

  const [message, setMessage] = useState("");
  const [roomIndex, setRoomIndex] = useState(0);
  const [notificationKey, setNotificationKey] = useState();
  const [notificationArr, setNotificationArr] = useState<Array<string>>([]);

  const [sender, setSender] = useState<user>();
  const [receiver, setReceiver] = useState<user>();

  const isMounted = useRef(false);
  const bottom = useRef<any>(null);

  const router = useRouter();

  const [isEdit, setEdit] = useState<number>(0);

  const [deletedMessage, setDeletedMessage] = useState<any>();

  const [editedMessage, setEditedMessage] = useState<any>();

  useEffect(() => {
    (async () => {
      if (!isMounted.current && airtable_id) {
        isMounted.current = true;
        let updatedRooms = [];
        setDataLoading(true);
        const roomRef = ref(realtimedb, `/rooms/${airtable_id}`);
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const key in data) {
            updatedRooms.push(data[key]);
          }
          const roomid = updatedRooms[roomIndex].id;
          const chatRef = ref(realtimedb, `chat/${roomid}`);
          await remove(chatRef);
          const messageref = ref(realtimedb, `messages/${roomid}`);
          const messagedata = await get(messageref);
          if (messagedata.exists()) {
            const data = messagedata.val();
            let updatedMessages = [];
            for (const key in data) {
              updatedMessages.push(data[key]);
            }
            console.log(updatedMessages);
            updatedMessages.pop();
            setMessages(updatedMessages);
          }
          setRooms(updatedRooms);
        } else {
          console.log("Hello!");
          toast.warning("You have no messages yet!");
          setDataLoading(false);
          router.push("/dashboard/");
          return;
        }

        ////
        if (accountType === "talent") {
          const client = await GetClientById(updatedRooms[roomIndex].receiver);
          setReceiver({ name: client.data.data.fields.Company, avatar: "" });
          const talent = await GetAccountInformation(airtable_id, "talent");
          console.log(talent);
          setSender({
            name: "Me",
            avatar: talent.data.fields?.Pictures?.[0]?.url || "",
          });
        } else if (accountType === "client") {
          const client = await GetClientById(airtable_id);
          setSender({ name: "Me", avatar: "" });
          const talent = await GetAccountInformation(
            updatedRooms[roomIndex].receiver,
            "talent"
          );
          console.log(talent);
          setReceiver({
            name: talent.data.fields["TALENT FULL NAME"],
            avatar: talent.data.fields?.Pictures?.[0]?.url || "",
          });
        }
        setDataLoading(false);
        console.log("Happened!");
        const roomid = updatedRooms[roomIndex].id;
        const msgRef = ref(realtimedb, `messages/${roomid}`);

        const getMessage = (snapshot: any) => {
          const updatedValue = snapshot.val();
          setNewMessage(updatedValue);
        };

        const getDeletedMessage = (snapshot: any) => {
          const value = snapshot.val();
          setDeletedMessage(value);
        };

        const getEditedMessage = (snapshot: any) => {
          const value = snapshot.val();
          setEditedMessage(value);
        }

        onChildAdded(msgRef, getMessage);

        onChildRemoved(msgRef, getDeletedMessage);

        onChildChanged(msgRef, getEditedMessage);

        return () => {
          off(msgRef, "child_added", getMessage);
          off(msgRef, "child_removed", getDeletedMessage);
        };
      }
    })();
  }, [airtable_id, roomIndex]);

  // useEffect(() => {
  //   if (!isMounted.current && rooms.length === 0) return;
  //   if(isMounted.current) return;
  //   console.log('Happened!');
  //   const roomid = rooms[roomIndex].id;
  //   const msgRef = ref(realtimedb, `messages/${roomid}`);

  //   const getMessage = (snapshot: any) => {
  //     const updatedValue = snapshot.val();
  //     setNewMessage(updatedValue);
  //   };

  //   onChildAdded(msgRef, getMessage);
  //   isMounted.current = true;

  //   return () => {
  //     off(msgRef, "child_added", getMessage);
  //   };
  // }, [rooms, roomIndex]);

  useEffect(() => {
    if (rooms.length === 0) return;
    const chatRef = ref(realtimedb, `chat/${airtable_id}`);

    const getMessage = (snapshot: any) => {
      const updatedKey = snapshot.key;
      const val = snapshot.val();
      if (
        rooms[roomIndex].id !== updatedKey &&
        updatedKey.indexOf(airtable_id) !== -1 &&
        val.notify === true
      ) {
        let index = rooms.findIndex((item: any) => item.id === updatedKey);
        toast.info(
          "You have a new undread message from '" + rooms[index].name + "'"
        );
        setNotificationKey(updatedKey);
      } else if (rooms[roomIndex].id === updatedKey) {
        const chat_ref = ref(realtimedb, `chat/${airtable_id}/${updatedKey}`);
        remove(chat_ref);
      }
    };
    onChildAdded(chatRef, getMessage);

    return () => {
      off(chatRef, "child_added", getMessage);
    };
  }, [rooms]);

  useEffect(() => {
    if (newMessage) {
      console.log("get New Message!");
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  }, [newMessage]);

  useEffect(() => {
    if (messages) {
      bottom?.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (notificationKey && !notificationArr.includes(notificationKey)) {
      setNotificationArr([...notificationArr, notificationKey]);
    }
  }, [notificationKey]);

  useEffect(() => {
    if(deletedMessage) {
      console.log(deletedMessage);
      const updatedMessages = messages.filter(
        (item: any) => item.created_at !== deletedMessage.created_at
      );
      setMessages(updatedMessages);
      setDeletedMessage(null);
    }
  }, [deletedMessage])

  useEffect(() => {
    if(editedMessage) {
      console.log('edited', editedMessage);
      const updatedMessages = [...messages];
      const index = updatedMessages.findIndex((item : any) => item.created_at === editedMessage.created_at);
      updatedMessages[index].message = editedMessage.message;
      setMessages(updatedMessages);
      setEditedMessage(null);
    }
  }, [editedMessage])

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    if (isEdit) {
      const created_at = isEdit;
      const msgRef = ref(
        realtimedb,
        `messages/${rooms[roomIndex].id}/${created_at}`
      );
      await update(msgRef, {
        created_at: created_at,
        message: message,
        sender: airtable_id,
      });
      setEdit(0);
      setMessage("");
      return;
    } else {
      let created_at = new Date().getTime();
      const chatRoomId = rooms[roomIndex].id;
      const chatRef = ref(
        realtimedb,
        `chat/${rooms[roomIndex].receiver}/${chatRoomId}`
      );
      await update(chatRef, {
        message: message,
        notify: true,
        sender: airtable_id,
        created_at: created_at,
      });
      const msgRef = ref(realtimedb, `messages/${chatRoomId}/${created_at}`);
      await update(msgRef, {
        message: message,
        sender: airtable_id,
        created_at: created_at,
      });
    }
    setMessage("");
  };

  const handleChangeChatRoom = async (index: number) => {
    const chatRef = ref(realtimedb, `chat/${airtable_id}/${rooms[index].id}`);
    isMounted.current = false;
    remove(chatRef);
    const updatedArr = notificationArr.filter(
      (item: any) => item !== rooms[index].id
    );
    setNotificationArr(updatedArr);
    setMessage("");
    setNewMessage("");
    setRoomIndex(index);
  };

  const handleEdit = async (time: number, index: number) => {
    setEdit(time);
    setMessage(messages[index].message);
  };

  const handleDelete = async (time: number, index: number) => {
    console.log(rooms[roomIndex].id);
    const msgRef = ref(realtimedb, `messages/${rooms[roomIndex].id}/${time}`);
    await remove(msgRef);
  };

  return (
    <main
      className={`max-[990px]:h-screen min-h-[calc(100vh-80px)] xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="px-[30px] lg:pt-[0px] pt-[90px]  w-full">
        <div className="flex flex-col gap-[30px]">
          <p className="text-[40px] font-bold">Messages</p>
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-row gap-2 ">
            <div className="bg-[#e7b53222] rounded-xl flex flex-col gap-3 p-3 min-w-[300px] max-w-[300px] relative">
              {rooms.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`hover:bg-[#e7b53255] rounded-xl p-3 cursor-pointer ${
                    roomIndex === index ? "bg-[#e7b53235]" : ""
                  }`}
                  onClick={() => handleChangeChatRoom(index)}
                >
                  {item.name}
                  {/* {item.name.length > 20
                    ? item.name.substring(0, 20) + "..."
                    : item.name} */}
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className={`text-red-400 my-auto transition-all h-[20px] absolute ${
                      notificationArr.includes(item.id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="bg-gray-50 w-full flex flex-col p-3 rounded-xl relative ">
              <div
                className="flex flex-col h-[calc(100vh-400px)] overflow-y-auto gap-2"
                ref={bottom}
              >
                {messages.map((item: any, index: number) => (
                  <Message
                    key={index}
                    message={item.message}
                    time={item.created_at}
                    senderUser={sender}
                    receiverUser={receiver}
                    index={index}
                    sender={airtable_id === item.sender}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))}
                <div ref={bottom} className="p-2"></div>
              </div>
              <div className="w-full bg-white shadow rounded-xl p-3 flex flex-row">
                <Input
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
                <button className="mx-[10px]">
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size="lg"
                    className="text-[#e7b532] hover:text-[#e7b53299]"
                    onClick={sendMessage}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
