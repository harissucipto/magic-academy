import React from 'react';
import { Grid } from '@material-ui/core';
import CourseItem from './CourseItem';

function CourseList({ list, pathDetailItem }) {
  if (!list?.length) return null;
  return (
    <Grid container spacing={3}>
      {list?.map((item) => (
        <Grid item key={item.id} xs={6} sm={3} md={4} lg={2}>
          <CourseItem
            key={item.id}
            {...item}
            pathDetailItem={pathDetailItem}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseList;
