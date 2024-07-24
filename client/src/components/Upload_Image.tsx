import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/image_upload_store";
import Close_Icon from "../assets/Upload_Image_Card_Images_and_Icons/Button.png";
import Cloud_Icon from "../assets/Upload_Image_Card_Images_and_Icons/upload-cloud-2-line.png";
import { uploadCardClose } from "../features/upload_card_triggers";
import axios from "axios";
import Delete_Icon from "../assets/Upload_Image_Card_Images_and_Icons/Vector.png";
import Crop_Icon from "../assets/Upload_Image_Card_Images_and_Icons/crop_icon.png";
import { selectedData } from "../features/selectedImage_reducer";
import { cropCardOpen } from "../features/crop_card_reducers";
import { cropData } from "../features/crop_card_data";

interface UploadedImage {
  id: string;
  name: string;
  size: string;
  url: string;
  progress: number;
}

const Upload_Image: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const openUploadCard = useSelector(
    (state: RootState) => state.imageUploadReducer.value
  );

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [progressState, setProgressState] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [limitMessage, setLimitmessage] = useState<string>("");

  const handleCloseCard = () => {
    dispatch(uploadCardClose());
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleUpload(droppedFiles);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleUpload(selectedFiles);
    }
  };

  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    const newImages: UploadedImage[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImage: UploadedImage = {
            id: "",
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            url: e.target?.result as string,
            progress: 0,
          };
          setUploadedImages((prevImages) => [...prevImages, newImage]);
          newImages.push(newImage);
        }
      };
      reader.readAsDataURL(file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total
            );

            newImages.forEach((image) => {
              setUploadedImages((prevImages) =>
                prevImages.map((prevImage) =>
                  prevImage.name === image.name
                    ? { ...prevImage, progress: percentCompleted }
                    : prevImage
                )
              );
            });
          },
        }
      );

      const { imageData } = response.data;
      setUploadedImages((prevImages) =>
        prevImages.map((image) => {
          if (image.name === newImages[0].name) {
            return { ...image, id: imageData._id };
          }
          return image;
        })
      );
      setTimeout(() => {
        setProgressState(false);
      }, 5000);
      console.log(response.data, "response");

      if (response.data.message === "") setErrorMessage(null);
      setProgressState(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        if (error.response?.status === 400) {
          setLimitmessage(
            error.response?.data.message || "Image limit reached."
          );
          setErrorMessage(
            error.response?.data.message || "Image limit reached."
          );
        } else if (error.message === "Network Error") {
          setErrorMessage(
            "An error occurred during the upload. Please check your network connection and try again."
          );
          setProgressState(false);
        } else {
          console.error("Axios error:", error.response?.data);
          setErrorMessage(
            error.response?.data.message ||
              "An unexpected error occurred during the upload. Please contact support if the issue persists."
          );
          setProgressState(false);
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage(
          "An unexpected error occurred during the upload. Please contact support if the issue persists."
        );
        setProgressState(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/images/upload/${id}`
      );
      console.log(response.data);
      setUploadedImages((prevImages) =>
        prevImages.filter((image) => image.id !== id)
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleImageSelection = (id: string) => {
    setSelectedImageId(id);
  };

  const handleSubmitSelectedImage = async () => {
    if (selectedImageId) {
      try {
        const response = await axios.post(
          `http://localhost:8000/images/upload/submit/${selectedImageId}`
        );
        console.log("selection value", response.data);

        dispatch(selectedData(response.data?.image.image_name));
        handleCloseCard();
      } catch (error) {
        console.error("Error submitting selected image:", error);
      }
    } else {
      setErrorMessage("Please select an image to submit.");
    }
  };

  const handleOpenCrop = (id: string) => {
    dispatch(cropCardOpen());
    dispatch(uploadCardClose());
    dispatch(cropData(id));
  };

  const handleCloseUpload = () => {
    dispatch(uploadCardClose());
  };

  return (
    <>
      {openUploadCard && (
        <section className="upload_card_main">
          <div className="upload_card">
            <div className="crop_card_content1">
              <div className="upload_heading_style">
                <span className="upload_header">Upload image(s)</span>
                <span className="upload_sub_header">
                  You may upload up to 5 images
                </span>
              </div>
              <button>
                <img
                  src={Close_Icon}
                  onClick={handleCloseCard}
                  alt="close_Icon"
                  className="close_icon_crop"
                />
              </button>
            </div>
            {limitMessage ? (
              <div className="dnd_card">
                <div className="dnd_details_main">
                  <span className="upload_header_error">
                    You've reached the image limit
                  </span>
                  <span className="upload_sub_header_error">
                    Remove one or more to upload more images.
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="dnd_card"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  ref={inputRef}
                />
                <div className="cloud_icon_container">
                  <img
                    src={Cloud_Icon}
                    alt="cloud_icon"
                    className="cloud_icon_styles"
                  />
                </div>
                <div className="dnd_details_main">
                  <span className="upload_header">
                    Click or drag and drop to upload
                  </span>
                  <span className="upload_sub_header">
                    PNG or JPG (Max 5MB)
                  </span>
                </div>
              </div>
            )}
            {uploadedImages.length > 0 && (
              <>
                <div className="upload_image_card_status_main">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="upload_image_status_card">
                      <div>
                        <img
                          src={image.url}
                          alt={image.name}
                          className="upload_image_status_style"
                        />
                      </div>

                      <div className="upload_image_status_card_content2">
                        <div className="upload_image_status_card_content2_1">
                          <div className="upload_image_status_card_content2_1_1">
                            <span className="upload_image_status_card_content2_1_1_1">
                              {image.name}
                            </span>
                            <span className="upload_image_status_card_content2_1_1_2">
                              {image.size}
                            </span>
                          </div>

                          {/* form starts from over here */}
                          {progressState || errorMessage ? (
                            <button
                              type="button"
                              className="close_icon2"
                              onClick={() => handleDelete(image.id)}
                            >
                              <img src={Close_Icon} alt="close_Icon" />
                            </button>
                          ) : (
                            <form>
                              <input
                                type="radio"
                                id="selection"
                                className="checkbox-round"
                                onChange={() => handleImageSelection(image.id)}
                              />
                            </form>
                          )}
                          {/* form ends over here */}
                        </div>
                        {errorMessage ? (
                          <div className="error-message_container">
                            <span className="error_message">
                              {errorMessage}
                            </span>
                          </div>
                        ) : progressState ? (
                          <div className="progress_bar_main">
                            <div className="progress_bar">
                              <div
                                className="progress_bar_fill"
                                style={{ width: `${image.progress}%` }}
                              ></div>
                            </div>
                            <span className="percentage_value">
                              {image.progress}%
                            </span>
                          </div>
                        ) : (
                          <div className="delete_crop_main">
                            <button
                              className="crop_button"
                              onClick={() => handleOpenCrop(image.id)}
                            >
                              <img
                                src={Crop_Icon}
                                alt="crop_icon"
                                className="common_icons"
                              />
                              Crop
                            </button>
                            <span className="dot">•</span>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="delete_button"
                            >
                              <img
                                src={Delete_Icon}
                                alt="delete_icon"
                                className="common_icons"
                              />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* cancel and confirm starts from over here */}
                <div className="crop_card_buttons">
                  <button
                    className="cancel_image_button"
                    onClick={handleCloseUpload}
                  >
                    Cancel
                  </button>
                  <button
                    className={` ${
                      !selectedImageId
                        ? "disable-button"
                        : "select_image_button"
                    }`}
                    onClick={handleSubmitSelectedImage}
                    disabled={!selectedImageId}
                  >
                    Select image
                  </button>
                </div>
                {/* cancel and confirm ends over here */}
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Upload_Image;
