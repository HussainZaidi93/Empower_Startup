// import { UploadFile } from '@mui/icons-material';
import { Box, Input, InputLabel } from '@mui/material';
import { useState } from 'react';
// import { Post } from 'src/actions/API/apiActions';
// import { Post_UploadImage_URL } from 'src/constants/apiURLs';

export default function UploadImage({ onSubmit }) {
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  console.log(imageFile);
//   const handleSubmit = () => {
//     try {
//       const formData = new FormData();
//       formData.append('profileimage', imageFile);
//       Post(
//         formData,
//         Post_UploadImage_URL,
//         (resp) => {
//           onSubmit(resp.fileName);
//         },
//         (error) => {
//         }
//       );
//     } catch (error) {}
//   };
  return (
    <>
      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '200px',
            height: '200px',
            borderRadius: '100px',
            marginTop: '10px',
          }}
        />
      )}
      <InputLabel htmlFor="image">Upload Image</InputLabel>
      <Box display="flex">
        <Input
        fullWidth
          placeholder="Choose Image"
          type="file"
          inputProps={{
            accept: 'image/*',
          }}
          onChange={(event) => {
            const file = event.currentTarget.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
              setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
          }}
          required
        />
            {/* <IconButton >
            <UploadFile fontSize="small" />
        </IconButton> */}
      </Box>
    </>
  );
}
