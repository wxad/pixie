import { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import "uno.css"
import "adui/es/style/base.css"
import PageIndex from "./PageIndex"
import Review from "./Review"

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PageIndex />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
