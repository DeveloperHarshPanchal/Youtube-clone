import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Plus } from "lucide-react";
import api from "../services/api";
import { loginSuccess, logoutSuccess } from "../store/userSlice";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import Button from "./Button";
import ChannelDialog from "./ChannelDialog";
import VideoDialog from "./VideoDialog";
import toast from "react-hot-toast";
import { Link } from "react-router";
import "./User.css";

function User() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isAuthenticated) {
      api
        .get("/me")
        .then((res) => {
          dispatch(loginSuccess({ ...res.data.data, accessToken }));
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <div className="user-container">
      {isAuthenticated ? (
        <>
          <button
            popoverTarget="create-box"
            title="Create"
            className="user-create-btn"
          >
            <Plus /> <span>Create</span>
          </button>

          <div id="create-box" popover="auto" className="user-popover">
            <div className="flex-col">
              <ChannelDialog />
              <VideoDialog />
            </div>
          </div>

          <button popoverTarget="user-profile" className="cursor-pointer">
            <Avatar
              src={user.avatar}
              alt={user.username}
              height={30}
              width={30}
            />
          </button>

          <div popover="auto" id="user-profile" className="user-popover">
            <div className="flex-col">
              <Avatar
                src={user.avatar}
                alt={user.username}
                className="avatar-lg"
              />
              <div className="text-center">
                <p className="font-bold">{user.email}</p>
                <p className="username">{user.username}</p>
              </div>
              <div className="separator"></div>

              <div className="flex-col">
                <h3 className="channels-header">My Channels</h3>
                {user.channels.length > 0 ? (
                  <div>
                    {user.channels.map((chan) => (
                      <Link
                        key={chan._id}
                        to={`/channel/${chan._id}`}
                        className="channel-link"
                      >
                        <Avatar src={chan.avatar} alt={chan.name} />
                        <span>{chan.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No Channels found</p>
                )}
              </div>

              <div className="separator"></div>

              <Button
                onClick={() => {
                  dispatch(logoutSuccess());
                  toast.success("Logout Successful");
                }}
                Icon={LogOut}
                title="Logout"
              />
            </div>
          </div>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default User;
