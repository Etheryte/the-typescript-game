import "./game.scss";

type Props = {
  isValid: boolean;
};

export default (props: Props) => {
  return (
    <div className={`game ${props.isValid ? "is-success" : ""}`}>
      <div className="top-edge" />
      <div className="clouds-high" />
      <div className="clouds-low" />
      <div className="hills" />
      <div className="ground-top">
        <div className="character-wrapper">
          <div className="character" />
        </div>
        <div className="obstacle" />
      </div>
      <div className="ground-fill" />
    </div>
  );
};
