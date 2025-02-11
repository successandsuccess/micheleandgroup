import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export const Message = ({
  message,
  sender,
  time,
  senderUser,
  receiverUser,
  handleEdit,
  handleDelete,
  index
}: {
  message: string;
  sender: boolean;
  time: number;
  senderUser: any;
  receiverUser: any;
  handleEdit: any;
  handleDelete: any;
  index: number;
}) => {
  const date = new Date(time);
  const hour = date.getHours();
  const minute = date.getMinutes();
  return (
    <div
      className={` flex flex-row ${sender ? "justify-end" : "justify-start"}`}
    >
      <div className="flex flex-col max-w-[70%]">
        <div
          className={` flex flex-row ${
            sender ? "justify-end" : "justify-start"
          }`}
        >
          {!sender ? (
            <Avatar
              src={
                receiverUser?.avatar ||
                "/assets/images/Placeholder_view_vector.svg"
              }
            />
          ) : (
            ""
          )}
          <p className="my-auto">
            {sender
              ? hour + ":" + minute + " " + senderUser?.name.split(" ")[0]
              : receiverUser?.name.split(" ")[0] + " " + hour + ":" + minute}
          </p>
          {sender ? (
            <Avatar
              src={
                senderUser?.avatar ||
                "/assets/images/Placeholder_view_vector.svg"
              }
            />
          ) : (
            ""
          )}
        </div>

        <div className={`flex w-full flex-row ${sender ? "justify-end" : 'justify-start'}`}>
          {!sender ? (
            ""
          ) : (
            <Dropdown>
              <DropdownTrigger>
                <button className="px-2 outline-none">:</button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown Variants"
                color="primary"
                variant="light"
              >
                <DropdownItem key="edit" onClick={() => handleEdit(time, index)}>Edit</DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => handleDelete(time, index)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <p
            className={`${
              sender
                ? "bg-[#e7b53233] rounded-l-xl rounded-tr-large"
                : "bg-gray-200 rounded-tl-xl rounded-r-xl"
            } p-3`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
