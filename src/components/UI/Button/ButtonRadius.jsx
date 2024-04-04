import React from "react";
import styled from "styled-components";

const Button = styled.button`
  font: inherit;
  width: 150px;
  margin: 10px 10px 10px 0px ;
  height: 34px;
  border: 3px solid #4F4557;
  border-radius: 45px;
  transition: all 0.3s;
  cursor: pointer;
  background: white;
  font-size: 1.2em;
  font-weight: 550;
  font-family: 'Montserrat', sans-serif;

  &:focus {
    outline: none;
  }

  &:hover{
  background: #F15A59;
  color: white;
  font-size: 1.2em;
  }
  &:active {
    background: #fff;
    border-color: #F0564A;
    color: #F0564A;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
  }
`;

export default Button;



