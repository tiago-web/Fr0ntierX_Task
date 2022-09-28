interface NFTCardProps {
  image: string;
  name: string;
  description: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ image, name, description }) => (
  <div className="nft-card">
    <img alt={name} src={image} />
    <p>{name}</p>
    <p>{description}</p>
  </div>
);

export default NFTCard;
