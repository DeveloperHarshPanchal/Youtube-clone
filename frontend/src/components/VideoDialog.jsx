import { Pen, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useRevalidator } from "react-router";
import z from "zod";
import Button from "./Button";
import Form from "./Form";
import "./VideoDialog.css";

const videoSchema = z.object({
  title: z.string().min(1, { error: "title is required" }),
  description: z.string().optional(),
  videoUrl: z
    .url({ error: "Invalid URL" })
    .refine((url) => url.includes("youtube.com") || url.includes("youtu.be"), {
      error: "URL must be from youtube.com or youtu.be",
    }),
  thumbnailUrl: z.url({ error: "Invalid URL" }),
  category: z.string().min(1, { error: "category is required" }),
});

function VideoDialog({ edit = false, video = {}, channelId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const channels = useSelector((state) => state.user.channels);
  const [activeChannelId, setActiveChannelId] = useState(
    channelId ?? channels[0]?._id ?? null
  );
  const activeChannel = channels.find((chan) => chan._id === activeChannelId);
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);

  const fields = [
    {
      name: "title",
      type: "text",
      defaultValue: video.title ?? "",
      placeholder: "Enter video title",
      required: true,
    },
    {
      name: "description",
      type: "text",
      defaultValue: video.description ?? "",
      placeholder: "Enter video description",
      required: false,
    },
    {
      name: "videoUrl",
      type: "url",
      defaultValue: video.videoUrl ?? "",
      placeholder: "Enter YouTube video URL",
      required: true,
    },
    {
      name: "thumbnailUrl",
      type: "url",
      defaultValue: video.thumbnailUrl ?? "",
      placeholder: "Enter video thumbnail URL",
      required: true,
    },
    {
      name: "category",
      type: "text",
      defaultValue: video.category ?? "",
      placeholder: "Enter video category",
      required: true,
    },
  ];

  const [isOpen, setIsOpen] = useState(true);
  const openDialog = () => {
    setIsOpen(true);
    dialogRef.current.showModal();
  };
  const closeDialog = () => {
    setIsOpen(false);
    setError(null);
    dialogRef.current.close();
  };

  function handleSuccess(data) {
    if (edit) revalidator.revalidate();
    else navigate(`/channel/${activeChannelId}`);
    closeDialog();
  }

  function handleError(code, error) {
    setError(error);
  }

  const title = edit ? "Edit" : "Upload Video";
  const Icon = edit ? Pen : Video;
  const submitPath = edit
    ? `/channel/${activeChannelId}/video/${video._id}`
    : `/channel/${activeChannelId}/video`;
  const method = edit ? "put" : "post";

  return (
    <div>
      <Button
        disabled={channels.length === 0}
        Icon={Icon}
        title={title}
        onClick={(evt) => {
          evt.stopPropagation();
          openDialog();
        }}
      />

      <dialog ref={dialogRef} onCancel={closeDialog}>
        {isOpen && (
          <div className="video-dialog-container">
            <div className="video-dialog-header">
              <h2>{title}</h2>
              <button onClick={closeDialog}>
                <X />
              </button>
            </div>

            <div className="video-dialog-channel">
              {edit ? (
                <p>Channel: {activeChannel?.name || "Unknown"}</p>
              ) : (
                <label>
                  Channel:
                  <select
                    value={activeChannelId}
                    onChange={(evt) => setActiveChannelId(evt.target.value)}
                  >
                    {channels.map((chan) => (
                      <option key={chan._id} value={chan._id}>
                        {chan.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <Form
              fields={fields}
              schema={videoSchema}
              onSuccess={handleSuccess}
              onError={handleError}
              submitPath={submitPath}
              submitButtonTitle={title}
              disableSubmit={!!error || channels.length === 0}
              method={method}
            />

            {error && <div className="video-dialog-error">{error}</div>}
          </div>
        )}
      </dialog>
    </div>
  );
}

export default VideoDialog;
