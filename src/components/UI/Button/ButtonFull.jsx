import React from 'react'
import styled from "styled-components";

export const ButtonFull = styled.button`
  font: inherit;
  padding: 0.5rem 1.5rem;
  border: 1px solid #1cb3ff;
  color: #1cb3ff;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
  cursor: pointer;
  width: 100%;
  border-radius: 10px;
  height: 50px;
  line-height: 34px;
  font-size: 20px;

  &:focus {
    outline: none;
  }

  &:hover,
  &:active {
    background: #1cb3ff;
    border-color: #1cb3ff;
    color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
    cursor: pointer;
  }
`;
export default ButtonFull