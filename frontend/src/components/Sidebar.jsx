import {
  ChevronRight,
  Clock,
  History,
  Home,
  ListVideo,
  SmartphoneCharging,
  SquarePlay,
  ThumbsUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import clsx from "clsx";
import "./SideBar.css";

function SideBar({ hidden }) {
  const subscriptions = useSelector((state) => state.user.subscriptions);
  const isAuthenticated = useSelector((state) => !!state.user.accessToken);

  const youSectionItems = [
    { title: "History", Icon: History },
    { title: "Playlist", Icon: ListVideo },
    { title: "Watch Later", Icon: Clock },
    { title: "Liked Videos", Icon: ThumbsUp },
    { title: "Your Videos", Icon: SquarePlay },
  ];

  return (
    <div className={clsx("sidebar", !hidden && "open")}>
      {/* Top Section */}
      <div className="sidebar-section">
        <NavLink
          to="/"
          className={({ isActive }) =>
            clsx("sidebar-link", isActive && "active")
          }
        >
          <Home />
          <span>Home</span>
        </NavLink>

        <div className="sidebar-link">
          <SmartphoneCharging />
          <span>Shorts</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Subscriptions */}
      <div className="sidebar-section">
        <div className="subscriptions-header">
          <span>Subscriptions</span>
          <ChevronRight />
        </div>

        {isAuthenticated ? (
          <div className="sidebar-section">
            {subscriptions.length > 0 ? (
              subscriptions.map(({ _id, name, avatar }) => (
                <NavLink
                  key={_id}
                  to={`/channel/${_id}`}
                  className={({ isActive }) =>
                    clsx("subscription-item", isActive && "active")
                  }
                >
                  <Avatar src={avatar} alt={name} />
                  <span className="subscription-name">{name}</span>
                </NavLink>
              ))
            ) : (
              <p className="sidebar-link">No Subscriptions Available</p>
            )}
          </div>
        ) : (
          <div className="sidebar-auth">
            <p>Login to subscribe</p>
            <LoginButton />
          </div>
        )}
      </div>

      <div className="sidebar-divider" />

      {/* You Section */}
      <div className="sidebar-section">
        <div className="you-header">
          <span>You</span>
          <ChevronRight />
        </div>

        {youSectionItems.map(({ title, Icon }) => (
          <div key={title} className="you-item">
            <Icon />
            <span>{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
