import React, { useState, useEffect, useRef } from 'react'

const useSharedRef = () => {
  const sharedNum = useRef(0)

  useEffect(() => {
    sharedNum.current = Number(sharedNum.current) + 1
  }, [])

  return [sharedNum.current]
}

export default useSharedRef
