import React from 'react';
import { Grid } from '@material-ui/core';
import CourseItem from './CourseItem';

function CourseList({ list }) {
  if (!list?.length) return <p>Kosong {JSON.stringify(list)}</p>;

  return (
    <Grid container spacing={2}>
      {list?.map((item) => (
        <Grid item key={item.id} xs={6} sm={3} md={4} lg={2}>
          <CourseItem key={item.id} {...item} />
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseList;
