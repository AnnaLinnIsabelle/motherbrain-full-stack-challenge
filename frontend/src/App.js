import React from "react";
import { DescriptionPage } from "./components/DescriptionsPage/DescriptionsPage";
import './variables.css';

export default function App() {
  return (
    <>
      <header>
        <h1>Motherbrain Assignment</h1>
      </header>
      <main>
        <DescriptionPage />
      </main>
      <footer></footer>
    </>
  );
}
