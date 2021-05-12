import React, { useReducer } from "react";
import uuid from "uuid"; //임의의 아이디 생성
import contactContext from "./contactContext";
import contactReduser from "./contactReduser";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from "../types";

const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: "John Smith",
        email: "ksjand1004@gmail.com",
        phone: "111-111-1111",
        type: "personal",
      },
      {
        id: 2,
        name: "Sam Smith",
        email: "ksjand1005@gmail.com",
        phone: "222-222-2222",
        type: "personal",
      },
      {
        id: 3,
        name: "IJIJ Smith",
        email: "ksjand1006@gmail.com",
        phone: "333-333-333",
        type: "professional",
      },
    ],
  };

  const [state, dispatch] = useReducer(contactReduser, initialState);
  //Add Contact

  //Delete Contact

  //Set Current Contact

  //Clear Current Contact

  //Update Contact

  //Filter Contacts

  //Clear Filter

  return (
    <contactContext.Provider value={{ contacts: state.contacts }}>
      {props.children}
    </contactContext.Provider>
  );
};

export default ContactState;
