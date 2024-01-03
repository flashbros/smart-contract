"use client"

import { useEffect, useState } from 'react'
import Oli from '../[components]/oli'

export default function Home() {
  const [age, setAge] = useState(28);

  useEffect(() => {
    console.log('age: ', age)
  }, [])

  return (
    <div>
      <h1>Web3 Test</h1>
      <p>Age: {age}</p>
      <button onClick={() => setAge(age + 1)}>Increase Age</button>
      <Oli essen={age} />
    </div>
  )
}
