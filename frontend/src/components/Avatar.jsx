import "./Avatar.css";

function Avatar({ src, alt, height, width, className = "" }) {
  const backupAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    alt || "default"
  }`;

  return (
    <div className={`avatar ${className}`}>
      <img
        src={src || backupAvatarUrl}
        alt={alt}
        height={height ?? 25}
        width={width ?? 25}
        className="avatar-img"
        onError={(evt) => {
          evt.currentTarget.src = backupAvatarUrl;
        }}
      />
    </div>
  );
}

export default Avatar;
