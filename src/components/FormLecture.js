import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';

function FormLecture() {
  const classes = useStyles();
  return (
    <div>
      <form className={classes.formLecture}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={1}></Grid>
              <Grid item xs={7}>
                <Typography variant="subtitle2">
                  Lecture Title
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  placeholder="e.g. Learn Javascript from scracth"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">
                  Thumbnail
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  placeholder="No file selected"
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <Typography variant="subtitle2">
                      Embeded Link Video
                    </Typography>
                    <TextField
                      fullWidth
                      variant="filled"
                      placeholder="insert embeded link video..."
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}>
                      <Typography variant="subtitle2">
                        Descriptions
                      </Typography>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        variant="filled"
                        placeholder="Briefly describe this course..."
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  type="submit">
                  Add Lecture
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  lecture: {
    borderRadius: '4px',
    padding: '1rem',
    cursor: 'pointer',
    marginLeft: '2rem',
    background: '#FFFFFF',
    border: '1px solid #F0F2F5',
    marginBottom: '8px',
  },
  formLecture: {
    marginBottom: '4rem',
    marginTop: '3rem',
  },
}));

export default FormLecture;
