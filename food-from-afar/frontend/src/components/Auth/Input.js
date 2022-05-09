import React from "react";
import { TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Input = (props, half) => {
    return (
        <Grid item xs={12}>
            <TextField
                name={props.name}
                onChange={props.handleChange}
                required
                variant="outlined"
                fullWidth
                label={props.label}
                autoFocus={props.autoFocus}
                type={props.type}
                InputProps={
                    props.name === "password"
                        ? {
                              endAdornment: (
                                  <InputAdornment position="end">
                                      <IconButton
                                          onClick={props.handleShowPassword}
                                      >
                                          {props.type === "password" ? (
                                              <Visibility />
                                          ) : (
                                              <VisibilityOff />
                                          )}
                                      </IconButton>
                                  </InputAdornment>
                              ),
                          }
                        : null
                }
            />
        </Grid>
    );
};

export default Input;
