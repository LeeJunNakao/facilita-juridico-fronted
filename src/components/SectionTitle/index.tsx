import { Grid, Typography } from "@mui/material";

type Props = {
  title: string;
};

const SectionTitle = ({ title }: Props) => {
  return (
    <Grid container>
      <Grid item paddingY={2} borderBottom={1} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
    </Grid>
  );
};

export default SectionTitle;
