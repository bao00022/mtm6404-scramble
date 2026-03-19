export function ScoreCard({ score }) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col items-center">
        <p className="text-4xl">{score.points}</p>
        <p className="uppercase">points</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-4xl">{score.strikes}</p>
        <p className="uppercase">strikes</p>
      </div>
    </div>
  );
}
