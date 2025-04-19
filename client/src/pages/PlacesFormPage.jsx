import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress]= useState('');
    const [description,setDesciption]=useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [perks,setPerks]=useState([]);
    const [extraInfo,setExtraInfo]= useState('');
    const [checkIn,setCheckIn]=useState('');
    const [checkOut,setCheckOut]=useState('');
    const [maxGuests,setMaxGuests]=useState(1); 
    const [price,setPrice] = useState(100);  
    const [redirect,setRedirect] = useState(false);
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(response => {
           const {data} = response;
           setTitle(data.title);
           setAddress(data.address);
           setAddedPhotos(data.photos);
           setDesciption(data.description);
           setPerks(data.perks);
           setExtraInfo(data.extraInfo);
           setCheckIn(data.checkIn);
           setCheckOut(data.checkOut);
           setMaxGuests(data.maxGuests);
           setPrice(data.price);
        });
    },[id])
    function inputHeader(text){
        return(
            <h2 className="mt-4 text-2xl">{text}</h2>
        )
    }
    function inputDescription(text){
        return(
            <p className="text-sm text-gray-500">{text}</p>
        )
    }
    function preInput(header,description){
        return(
            <>
               {inputHeader(header)}
               {inputDescription(description)}
            </>
        )
    }
    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
          title, address, addedPhotos,
          description, perks, extraInfo,
          checkIn, checkOut, maxGuests, price,
        };
        if (id) {
          // update
          await axios.put('/places', {
            id, ...placeData
          });
          setRedirect(true);
        } else {
          // new place
          await axios.post('/places', placeData);
          setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to ={'/account/places'} />
    }
    return (
        <div>
            <AccountNav />

            <form onSubmit={savePlace}>
                {preInput('Title','title for your place. should be short and catchy as in advertisement')}
                <input type="text" value={title} onChange={ev =>setTitle(ev.target.value)} placeholder="title, for expample: My lovely apartment"/>
                {preInput('Address','Address to this place')}
                <input type="text" value={address} onChange={ev =>setAddress(ev.target.value)} placeholder="address"/>
                {preInput('Photos','More =better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                {preInput('Description','Description of the place')}
                <textarea value={description} onChange={ev =>setDesciption(ev.target.value)}/>
                {preInput('Perks','select all the perks')}
                <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput('Extra Info','House rule, etc..')}
                <textarea value={extraInfo} onChange={ev =>setExtraInfo(ev.target.value)}/>
                {preInput('Check in&out times','add check in and out time, remember to have some time window for cleaning the room between guests')}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <div>
                    <h3 className="mt-2 -mb-2">Check in time</h3>
                    <input type="text" value={checkIn} onChange={ev =>setCheckIn(ev.target.value)} placeholder="14"/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-2">Check out time</h3>
                    <input type="text" value={checkOut} onChange={ev =>setCheckOut(ev.target.value)} placeholder="11" />
                </div>
                <div>
                    <h3 className="mt-2 -mb-2">Max number of guests</h3>
                    <input type="number" value={maxGuests} onChange={ev =>setMaxGuests(ev.target.value)}/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Price per night</h3>
                    <input type="number" value={price} onChange={ev => setPrice(ev.target.value)}/>
                </div>
                </div>
                <div>
                    <button className="my-4 primary">Save</button>
                </div>
                </form>
                </div>
    );
}