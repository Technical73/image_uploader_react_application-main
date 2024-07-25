import { useDispatch, useSelector } from "react-redux";
import Close_Icon from "../assets/Crop_Card_Images_and_Icons/Button.png";
import { RootState } from "../store/image_upload_store";
import { cropCardClose } from "../features/crop_card_reducers";
import { useEffect, useState } from "react";
import axios from "axios";
import { uploadCardOpen } from "../features/upload_card_triggers";

const Crop_Image = () => {
  const cropOpen = useSelector(
    (state: RootState) => state.imageCropTriggers.value
  );
  const cropId = useSelector((state: RootState) => state.cropImage.value);
  const dispatch = useDispatch();

  const [imageURL, setImageURL] = useState(null);

  let handleOpenUpdate = () => {
    dispatch(cropCardClose());
    dispatch(uploadCardOpen());
  };
  const handleCloseCrop = () => {
    dispatch(cropCardClose());
  };

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/images/upload/getimage/${cropId}`
        );
        console.log("Server response:", response.data.image.image_name);
        setImageURL(response.data.image.image_name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cropId]);

  return (
    <>
      {/* main container starts from over here */}
      {cropOpen && (
        <section className="crop_main_container">
          {/* card starts */}
          <div className="crop_card">
            {/* header and close icon starts*/}
            <div className="crop_card_content1">
              <h2>Crop your picture</h2>
              <button onClick={handleCloseCrop}>
                <img
                  src={Close_Icon}
                  alt="close_Icon"
                  className="close_icon_crop"
                />
              </button>
            </div>
            {/* header and close icon ends */}
            {/* Crop box starts from here */}
            <div className="crop_box">
              {imageURL ? (
                <img
                  src={`http://localhost:8000/images/${imageURL}`}
                  alt="crop_image"
                  className="crop_image"
                />
              ) : (
                <p>Loading...</p> // Show loading text while the image is being fetched
              )}
            </div>
            {/* crop box ends over here */}
            {/* cancel and confirm starts from over here */}
            <div className="crop_card_buttons">
              <button
                className="update_button_style"
                onClick={handleOpenUpdate}
              >
                Cancel
              </button>
              <button onClick={handleOpenUpdate} className="crop_save_button">
                Confirm
              </button>
            </div>
            {/* cancel and confirm ends over here */}
          </div>
          {/* card ends */}
        </section>
      )}
      {/* main container ends over here */}
    </>
  );
};

export default Crop_Image;
