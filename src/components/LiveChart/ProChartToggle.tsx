import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
const ToggleButton = styled.span<{ size?: string; element?: HTMLSpanElement }>`
  position: absolute;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.primary};
  ${({ element }) => `transform: translateX(${element?.offsetLeft || 0}px); width: ${element?.offsetWidth || 48}px;`}
  border-radius: ${({ size }) => (size === 'md' ? '16px' : '12px')};
  height: 100%;
  
  top: 0;
`

const ToggleElement = styled.span<{
  isActive?: boolean
  size?: string
  border?: boolean
  disabled?: boolean
}>`
  font-size: ${({ size }) => (size === 'md' ? '16px' : '12px')};
  font-weight: 500;
  height: ${({ size, border }) => (size === 'md' ? 32 : 20) + (border ? 0 : 2) + 'px'};
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1;
  transition: all 0.2s ease;
  color: ${({ theme, isActive, disabled }) => (isActive ? theme.text14 : disabled ? theme.buttonGray : theme.subText)};
  cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
  :hover {
    color: ${({ theme, isActive, disabled }) => (isActive ? theme.white : disabled ? theme.buttonGray : theme.text2)};
  }
`

const ToggleWrapper = styled.button<{ size?: string; border?: boolean; background?: string }>`
  position: relative;
  border-radius: ${({ size }) => (size === 'md' ? '18px' : '12px')};
  border: ${({ background, border }) => (border ? `2px solid ${background}` : 'none')};
  background: ${({ background }) => background};
  display: flex;
  width: fit-content;
  outline: none;
  padding: 0;
`

export interface IToggleButton {
  name: string
  title: string
  disabled?: boolean
}
export interface ProChartToggleProps {
  id?: string
  activeName?: string
  buttons?: IToggleButton[]
  toggle: (name: string) => void
  size?: 'sm' | 'md'
  border?: boolean
  bgColor?: 'background' | 'buttonBlack'
}

export default function ProChartToggle({
  id,
  activeName = 'on',
  buttons = [
    { name: 'on', title: 'On' },
    { name: 'off', title: 'Off' },
  ],
  toggle,
  size = 'sm',
  border = false,
  bgColor = 'background',
}: ProChartToggleProps) {
  const buttonsRef = useRef<any>({})
  const theme = useTheme()
  const [activeElement, setActiveElement] = useState()

  useEffect(() => {
    setActiveElement(buttonsRef.current[activeName])
  }, [activeName])

  return (
    <ToggleWrapper
      id={id}
      size={size}
      border={border}
      background={`${theme[bgColor]}${buttons.some((b: any) => b.disabled) ? '20' : ''}`}
    >
      {buttons.map(button => {
        return (
          <ToggleElement
            key={button.name}
            ref={el => {
              buttonsRef.current[button.name] = el
            }}
            isActive={activeName === button.name}
            size={size}
            border={border}
            disabled={button.disabled}
            onClick={() => toggle(button.name)}
          >
            {button.title}
          </ToggleElement>
        )
      })}
      <ToggleButton element={activeElement} size={size} />
    </ToggleWrapper>
  )
}
