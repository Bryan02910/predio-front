import { initializeApp } from "firebase/app";
import { getStorage, ref , uploadBytes , getDownloadURL , deleteObject } from "firebase/storage";

import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBCtHRUNJGuXspfoYB10UpRoPZAnG61MRc",
    authDomain: "predio-2.firebaseapp.com",
    projectId: "predio-2",
    storageBucket: "predio-2.appspot.com",
    messagingSenderId: "927735829064",
    appId: "1:927735829064:web:adf691fe46e9cb2f07fe7d"
};


    async function saveFile(imagetoUpload){

        if(imagetoUpload == null) return ;

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        let imageRef = ref(storage, `images/${imagetoUpload.name}`);

         let snapshot = await uploadBytes(imageRef, imagetoUpload) ;
        
         imageRef = ref(storage, snapshot.metadata.fullPath);
         let url = await getDownloadURL(imageRef);
         return  url ;
    };


  async function getFile(){

     const app = initializeApp(firebaseConfig);
     const storage = getStorage(app);
     const imageRef = ref(storage, `images/img1.jpg`);

     let url = await getDownloadURL(imageRef);
     return url;
  };


  /*async function deleteFile(imagePath) {
    try {
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const imageRef = ref(storage, imagePath);
  
      await deleteObject(imageRef);
  
      // File deleted successfully
      console.log('Image deleted successfully.');
    } catch (error) {
      // Handle errors
      console.error('Error deleting the image:', error);
    }
  };*/

  async function deleteFile(imagePath ){
 
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageRef = ref(storage, imagePath );
 
      deleteObject(imageRef).then(() => {
         // File deleted successfully
      }).catch((error) => {
      // Uh-oh, an error occurred!
      });
     };
  

export {saveFile , getFile , deleteFile};