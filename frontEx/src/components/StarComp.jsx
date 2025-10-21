import StarIcon from "@mui/icons-material/Star";
//<StarIcon sx={{ color: "#000" }} />;
export const StarComp = ({ starNum }) => {
  let stars = Array(starNum).fill(0);

  return (
    <div style={{ display: "flex" }}>
      {stars.map((_, index) => (
        <StarIcon key={index} sx={{ color: "#ffb703" }} />
      ))}
    </div>
  );
};
