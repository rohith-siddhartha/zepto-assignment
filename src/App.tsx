import React from "react";
import {aliaPic, premPic, ranbirPic, vkPic} from './imgLinks'

type User = {
  name: string;
  imgSrc: string;
  email: string;
};

const users = [
  {
    name:"Dolly Singh",
    imgSrc:aliaPic,
    email:"dollysingh@gmail.com"
  },
  {
    name:"Mallela Prem",
    imgSrc:premPic,
    email:"prem.m@gmail.com"
  },
  {
    name:"Virat Kohli",
    imgSrc:vkPic,
    email:"viratkohli@gmail.com"
  },
  {
    name:"Ranbir kapoor",
    imgSrc:ranbirPic,
    email:"ranbir.kapoor@gmail.com"
  }
];

function App() {

  const [searchKey, setSearchKey] = React.useState<string>("");
  const [pickedUsers, setPickedUsers] = React.useState<User[]>([]);
  const [highlightLastUser, setHighlightLastUser] = React.useState<boolean>(false);
  const [highlightElement, setHighlightedElement] = React.useState<number>(-1);
  const [showList, setShowList] = React.useState<boolean>(false);


  function handleSearchKeyChange(key:string){
      if(key.length > 0){
        setHighlightLastUser(false);
      }
      setSearchKey(key);
  }

  function matchesSearchKey(key:string, name:string){

    for (const word of name.toLowerCase().split(' ')) {
      if (word.startsWith(key.toLowerCase())) {
        return true;
      }
    }
    return false;  

  }

  function handleKeyDown (event:React.KeyboardEvent<HTMLInputElement>) {
    if(event.key === 'Backspace'){
      if (pickedUsers.length>0 && searchKey==="") {
        console.log("hui");
        if(highlightLastUser===false){
          setHighlightLastUser(true);
        }else{
          setPickedUsers(pickedUsers.filter((_user, key) => {return key!==pickedUsers.length-1}));
          setHighlightLastUser(false);
        }
      }
    }else if(event.key === 'ArrowDown'){
      if(highlightElement < getFilteredUsers().length-1)
      setHighlightedElement(highlightElement+1);
    }else if(event.key === 'ArrowUp'){
      if(highlightElement > -1)
      setHighlightedElement(highlightElement-1);
    }else if(event.key === 'Enter'){
      if(highlightElement >=0 && highlightElement < getFilteredUsers().length){
        setPickedUsers([...pickedUsers,getFilteredUsers()[highlightElement]]);
      }
    }

  }

  function getFilteredUsers(){
    return users.filter(user => {
      return pickedUsers.indexOf(user)===-1 && (searchKey==="" || matchesSearchKey(searchKey, user.name));
    });
  }

  return (
    <div style={{width:"70%", display:"flex", flexDirection:"column", alignItems:"center", marginLeft:"auto", marginRight:"auto"}}>
        <h1 style={{fontSize:"40px", fontWeight:"bold", color:"blue", marginBottom:"30px"}}>Pick Users</h1>
        <div style={{width:"100%", borderBottom:"3px solid #b8c9f1", padding:"10px", display:"flex", flexWrap:"wrap", flexDirection:"row"}}>
        
        {
          pickedUsers.map( (user, key) => <Chip user={user} highlight={key===pickedUsers.length-1?highlightLastUser:false}  pickedUsers={pickedUsers} setPickedUsers={setPickedUsers} />)
        }

        <div style={{display:"inline-block", height:"60px", flexGrow:"1"}}>
          <input type="text" className="input" onFocusCapture={()=>{setShowList(true)}} 
            onKeyDown={(event) => handleKeyDown(event)} style={{width:"100%", height:"60px", border:"none", fontSize:"20px", outline:"none"}} 
            value={searchKey} placeholder="Add new user..." onChange={(e)=>{handleSearchKeyChange(e.target.value)}}></input>
          {
          ( searchKey.length > 0 || showList)  && 
          <div style={{width:"500px", height:"250px", boxShadow:"0 3px 10px rgb(0 0 0 / 0.2)", position:"absolute", backgroundColor:"white", overflowY:"scroll", zIndex:"1"}} className="hover2">
            {getFilteredUsers().length==0? <h1 style={{margin:"10%"}}>No matching users</h1> : getFilteredUsers().map( (user, key) => {
              return <UserCard user={user} highlighted={key===highlightElement} setShowList={setShowList} pickedUsers={pickedUsers} setSearchKey={setSearchKey} setPickedUsers={setPickedUsers} />;
            })}
          </div>
          }
        </div>

        </div>
      </div>
  )
}

function Chip({user, highlight, pickedUsers, setPickedUsers}:
  {user:User, highlight:boolean, pickedUsers:User[], setPickedUsers:React.Dispatch<React.SetStateAction<User[]>>}){

  const borderStyle :string = highlight===true?'solid':'none';

  function removeUser(){
    setPickedUsers(pickedUsers.filter(userKey => {
      return userKey!==user;
    }))
  }

  return (
    <div style={{height:"40px", padding:"0px", borderRadius:"40px", alignItems:"center", borderColor:"#3333ff", border:"2px", display:"flex", flexDirection:"row", backgroundColor:"#cbcfd5", margin:"10px", borderStyle:borderStyle}}>
      <img style={{  width:"40px", height:"40px",  borderRadius:"50%", overflow:"hidden"}} src={user.imgSrc}></img>
      <h3 style={{marginLeft:"10px", color:"#555860", marginRight:"10px"}}>{user.name}</h3>
      <div className="circle" onClick={removeUser}>
        <div className="close-icon">+</div>
      </div>
    </div>
  );
}

function UserCard({user, highlighted, setShowList, pickedUsers, setSearchKey, setPickedUsers}
  :{user:User, highlighted:boolean, setShowList:React.Dispatch<React.SetStateAction<boolean>>, pickedUsers:User[], setSearchKey:React.Dispatch<React.SetStateAction<string>>, setPickedUsers:React.Dispatch<React.SetStateAction<User[]>>}){

  function handleClick(){
    setPickedUsers([...pickedUsers, user]);
    setSearchKey("");
    setShowList(false);
  }

  const [bgColor, setBgColor] = React.useState<string>('white');

  return (
    <div onMouseDown={handleClick} onMouseEnter={()=>{setBgColor('#ebebeb')}} onMouseLeave={()=>{setBgColor('white')}} 
      style={{padding:"2%", height:"50px", width:"96%", alignItems:"center", display:"flex", flexDirection:"row", backgroundColor:highlighted?"#ebebeb":bgColor}}>
      <div style={{width:"10%"}}>
        <img style={{width:"40px", height:"40px",  borderRadius:"50%", overflow:"hidden"}} src={user.imgSrc}></img>
      </div>
      <div style={{minWidth:"30%"}}>
        <h3 style={{marginLeft:"10px", color:"#555860", marginRight:"10px", fontSize:"16px", fontFamily:"arial"}}>{user.name}</h3>
      </div>
      <div style={{maxWidth:"60%"}}>
        <h3 style={{marginLeft:"10px", color:"#555860", marginRight:"10px", fontFamily:"arial", fontSize:"16px", fontWeight:"lighter"}}>{user.email}</h3>
      </div>
    </div>
  );
}

export default App
