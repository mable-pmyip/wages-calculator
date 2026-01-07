import styled from 'styled-components'
import type { User } from 'firebase/auth'

interface HeaderProps {
  user: User
  signOut: () => Promise<void>
  settings: { deductMPF: boolean }
  updateSettings: (settings: { deductMPF: boolean }) => void
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}

const AppHeader = styled.header`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
`

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 1.8rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #4ade80;
  }

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  @media (max-width: 640px) {
    justify-content: flex-end;
    gap: 8px;
  }
`

const UserMenuContainer = styled.div`
  position: relative;
`

const UserTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);

    img {
      border-color: #22c55e;
      box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
    }

    span {
      color: #4ade80;
    }
  }
`

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4ade80;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`

const UserName = styled.span`
  font-weight: 500;
  color: #e5e5e5;
  font-size: 16px;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 12px;
  min-width: 240px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease-out;
  backdrop-filter: blur(10px);

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 128, 0.3) 50%, transparent 100%);
  margin: 4px 0;
`

const DropdownItem = styled.div`
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #e5e5e5;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: linear-gradient(90deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.05) 100%);
    padding-left: 22px;
  }

  &:active {
    background: rgba(74, 222, 128, 0.2);
  }
`

const MPFToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #4ade80;
    border-radius: 4px;
  }

  span {
    flex: 1;
    user-select: none;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
`

export const Header = ({ user, signOut, settings, updateSettings, showDropdown, setShowDropdown, dropdownRef }: HeaderProps) => {
  return (
    <AppHeader>
      <GitHubLink
        href="https://github.com/mable-pmyip/wages-calculator"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
      >
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </GitHubLink>
      
      <UserInfo>
        <UserMenuContainer ref={dropdownRef}>
          <UserTrigger onClick={() => setShowDropdown(!showDropdown)}>
            {user.photoURL && (
              <UserAvatar
                src={user.photoURL}
                alt={user.displayName || 'User'}
              />
            )}
            <UserName>{user.displayName || user.email}</UserName>
          </UserTrigger>
          {showDropdown && (
            <UserDropdown>
              <DropdownDivider />
              <DropdownItem onClick={(e) => e.stopPropagation()}>
                <MPFToggle>
                  <input
                    type="checkbox"
                    checked={settings.deductMPF}
                    onChange={(e) => updateSettings({ deductMPF: e.target.checked })}
                  />
                  <span>Deduct MPF</span>
                </MPFToggle>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={signOut}>
                <span>Logout</span>
              </DropdownItem>
            </UserDropdown>
          )}
        </UserMenuContainer>
      </UserInfo>
    </AppHeader>
  )
}
