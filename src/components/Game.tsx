import "./game.scss";

export default () => {
  return (
    <div className="game">
      <div className="top-edge" />
      <div className="clouds-high" />
      <div className="clouds-low" />
      <div className="hills" />
      <div className="ground-top">
        <div className="character" />
        <div className="obstacle" />
      </div>
      <div className="ground-fill" />
    </div>
  );
};
