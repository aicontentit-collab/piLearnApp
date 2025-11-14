
import styled from 'styled-components';
import { FiExternalLink, FiZap, FiTrendingUp, FiStar, FiAward, FiInfo } from 'react-icons/fi';

const SidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 200ms ease;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #c0c0c0;
  }
`;

const ProfileSection = styled.div`
  position: relative;
  margin-bottom: 32px;
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    border-radius: 20px;
    opacity: 0.15;
    filter: blur(8px);
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.25;
  }
`;

const ProfileCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: ${props => props.$width < 250 ? '12px' : '20px'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: ${props => props.$width < 250 ? '8px' : '16px'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: ${props => props.$width < 250 ? '40px' : props.$width < 200 ? '36px' : '56px'};
  height: ${props => props.$width < 250 ? '40px' : props.$width < 200 ? '36px' : '56px'};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.$width < 250 ? '16px' : props.$width < 200 ? '14px' : '24px'};
  font-weight: 600;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  
  ${ProfileCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

const StatusDot = styled.div`
  position: absolute;
  bottom: ${props => props.$width < 250 ? '2px' : '4px'};
  right: ${props => props.$width < 250 ? '0' : '2px'};
  width: ${props => props.$width < 250 ? '10px' : props.$width < 200 ? '8px' : '14px'};
  height: ${props => props.$width < 250 ? '10px' : props.$width < 200 ? '8px' : '14px'};
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: ${props => props.$width < 180 ? 'none' : 'block'};
`;

const Username = styled.div`
  font-size: ${props => props.$width < 250 ? '13px' : '14px'};
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Name = styled.div`
  font-size: ${props => props.$width < 250 ? '11px' : '13px'};
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.$width < 200 ? '4px' : '8px'};
  font-size: ${props => props.$width < 250 ? '12px' : '13px'};
  font-weight: 600;
  color: #1a1a1a;
  
  svg {
    color: ${props => props.$iconColor || '#667eea'};
    flex-shrink: 0;
    width: ${props => props.$width < 200 ? '14px' : '16px'};
    height: ${props => props.$width < 200 ? '14px' : '16px'};
  }
  
  span {
    display: ${props => props.$width < 180 ? 'none' : 'inline'};
  }
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: ${props => props.$width < 180 ? 'none' : 'block'};
  
  &:hover {
    background: #f0f0ff;
    color: #5568d3;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$width < 250 ? '8px' : '12px'};
  margin-bottom: 32px;
`;

const Card = styled.div`
  position: relative;
  background: ${props => props.$gradient ? 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)' : '#fafafa'};
  border-radius: ${props => props.$width < 250 ? '10px' : '14px'};
  padding: ${props => props.$width < 250 ? '10px' : '14px'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: ${props => props.$glowColor || 'linear-gradient(135deg, #667eea, #764ba2)'};
    border-radius: ${props => props.$width < 250 ? '11px' : '15px'};
    opacity: 0;
    filter: blur(10px);
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: transparent;
    
    &::before {
      opacity: 0.2;
    }
  }
`;

const CardIcon = styled.div`
  width: ${props => {
    if (props.$width < 200) return '100%';
    return props.$width < 250 ? '50px' : '100%';
  }};
  height: ${props => {
    if (props.$width < 200) return '80px';
    return props.$width < 250 ? '50px' : '100px';
  }};
  border-radius: ${props => props.$width < 250 ? '8px' : '10px'};
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.$width >= 250 || props.$width < 200 ? '12px' : '0'};
  margin-right: ${props => props.$width >= 200 && props.$width < 250 ? '12px' : '0'};
  flex-shrink: 0;
  transition: transform 0.3s ease;
  
  svg {
    width: ${props => {
      if (props.$width < 200) return '28px';
      return props.$width < 250 ? '24px' : '40px';
    }};
    height: ${props => {
      if (props.$width < 200) return '28px';
      return props.$width < 250 ? '24px' : '40px';
    }};
    color: white;
  }
  
  ${Card}:hover & {
    transform: scale(1.05) rotate(5deg);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: ${props => {
    if (props.$width < 200) return 'column';
    return props.$width < 250 ? 'row' : 'column';
  }};
  align-items: ${props => props.$width >= 200 && props.$width < 250 ? 'center' : 'stretch'};
  flex: 1;
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardTitle = styled.h4`
  font-size: ${props => props.$width < 250 ? '12px' : '13px'};
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 ${props => props.$width < 250 ? '2px' : '4px'} 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardDescription = styled.p`
  font-size: ${props => props.$width < 250 ? '10px' : '12px'};
  color: #6b7280;
  margin: 0;
  display: ${props => props.$width < 180 ? 'none' : '-webkit-box'};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const Badge = styled.span`
  display: ${props => props.$width < 180 ? 'none' : 'inline-flex'};
  align-items: center;
  gap: 4px;
  padding: ${props => props.$width < 250 ? '2px 6px' : '4px 10px'};
  background: ${props => props.$bg || 'linear-gradient(135deg, #667eea, #764ba2)'};
  color: white;
  font-size: ${props => props.$width < 250 ? '9px' : '10px'};
  font-weight: 600;
  border-radius: 6px;
  margin-bottom: ${props => props.$width < 250 ? '4px' : '8px'};
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

const Link = styled.a`
  display: ${props => props.$width < 180 ? 'none' : 'inline-flex'};
  align-items: center;
  gap: 6px;
  font-size: ${props => props.$width < 250 ? '10px' : '11px'};
  color: #667eea;
  font-weight: 600;
  margin-top: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: #5568d3;
    
    svg {
      transform: translate(2px, -2px);
    }
  }
`;

const ProductSidebar = ({ sidebarWidth = 360 }) => {

  const profile = {
    username: 'demo_user',
    name: 'Demo User',
    initials: 'DU',
  };

  const infos = [
    {
      icon: FiZap,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      title: 'New Feature: Dark Mode',
      description: 'Enable dark mode for a better night-time experience.',
      badge: 'New',
      badgeBg: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      icon: FiStar,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      title: 'Product Tip: Quick Search',
      description: 'Use the search bar to find items faster.',
      badge: 'Tip',
      badgeBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      icon: FiAward,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      title: 'Update: Version 2.0',
      description: 'Check out the latest improvements and bug fixes.',
      badge: 'Update',
      badgeBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
  ];

  return (
    <SidebarContainer>
      {/* Profile */}
      <ProfileSection>
        <ProfileCard $width={sidebarWidth}>
          <AvatarWrapper>
            <Avatar $width={sidebarWidth}>{profile.initials}</Avatar>
            <StatusDot $width={sidebarWidth} />
          </AvatarWrapper>
          <ProfileInfo $width={sidebarWidth}>
            <Username $width={sidebarWidth}>{profile.username}</Username>
            <Name $width={sidebarWidth}>{profile.name}</Name>
          </ProfileInfo>
        </ProfileCard>
      </ProfileSection>

      {/* Product Highlights */}
      <SectionHeader>
        <SectionTitle $width={sidebarWidth} $iconColor="#667eea">
          <FiZap />
          <span>Highlights</span>
        </SectionTitle>
        <SeeAllButton $width={sidebarWidth}>See All</SeeAllButton>
      </SectionHeader>
      
      <CardList $width={sidebarWidth}>
        {infos.map((info, idx) => {
          const IconComponent = info.icon;
          return (
            <Card
              key={idx}
              $width={sidebarWidth}
              $glowColor={info.gradient}
            >
              <Badge $width={sidebarWidth} $bg={info.badgeBg}>
                {info.badge}
              </Badge>
              <CardContent $width={sidebarWidth}>
                <CardIcon $width={sidebarWidth} $gradient={info.gradient}>
                  <IconComponent />
                </CardIcon>
                <CardBody>
                  <CardTitle $width={sidebarWidth}>{info.title}</CardTitle>
                  <CardDescription $width={sidebarWidth}>
                    {info.description}
                  </CardDescription>
                </CardBody>
              </CardContent>
            </Card>
          );
        })}
      </CardList>
    </SidebarContainer>
  );
};

export default ProductSidebar;