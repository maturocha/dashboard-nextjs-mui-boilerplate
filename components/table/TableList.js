import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as Time from '../helpers/Time';



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableTitle: {
    marginBottom: '4px',
  },
  container: {
    maxHeight: 440,
  },
});

export default function TableList(props) {
  const classes = useStyles();

  const { columns, data, title, firstColumnDate } = props

  return (
    <>
      <Typography variant="h6" className={classes.tableTitle}>
                  {title}
      </Typography>
      <Paper className={classes.root}>
      <TableContainer className={classes.container}>

        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              {data.map((item, key) => (
                            <TableRow key={key}>
                                {Object.values(item).map((cell, cellKey) => {
                  
                                    if (cellKey === 0) {
                                        return (
                                            <TableCell
                                                key={cellKey}
                                                component="th"
                                                scope="row"
                                            >
                                                {firstColumnDate ? new Date(cell).toLocaleDateString('es-AR', {
                                                                                                      timeZone: 'UTC',
                                                                                                      day : 'numeric',
                                                                                                      month : 'short'
                                                                                                  }).split(' ').join(' ') : 
                                                                    cell}
                                            </TableCell>
                                        );
                                    }

                                    return (
                                        <TableCell key={cellKey}>
                                            {cell}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </>
  );
}