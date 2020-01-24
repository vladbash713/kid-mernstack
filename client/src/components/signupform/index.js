import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import  LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUpForm() {
  const classes = useStyles();
  const [languages, setLanguages] = React.useState({
    language: '',
    name: '',
  });
  const [countries, setCountries] = React.useState({
    country: '',
    name: '',
  });
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  function handleLanguage(event) {
    setLanguages(oldLanguages => ({
      ...oldLanguages,
      [event.target.name]: event.target.value,
    }));
  }

  function handleCountry(event) {
    setCountries(oldCountries => ({
      ...oldCountries,
      [event.target.name]: event.target.value,
    }));
  }

  
  const [selectedRole, setSelectedRole] = React.useState('a');

  function handleRole(event) {
    setSelectedRole(event.target.value);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="school"
                label="School"
                name="school"
                autoComplete="school"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel ref={inputLabel} htmlFor="outlined-lang-simple">
                  Language
                </InputLabel>
                <Select
                  value={languages.language}
                  onChange={handleLanguage}
                  input={<OutlinedInput labelWidth={labelWidth} name="language" id="outlined-lang-simple" />}
                >
                  <MenuItem value={0}>English</MenuItem>
                  <MenuItem value={1}>French</MenuItem>
                  <MenuItem value={2}>Canadian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel ref={inputLabel} htmlFor="outlined-country-simple">
                  Country
                </InputLabel>
                <Select
                  value={countries.country}
                  onChange={handleCountry}
                  input={<OutlinedInput labelWidth={labelWidth} name="country" id="outlined-country-simple" />}
                >
                  <MenuItem value={0}>United States</MenuItem>
                  <MenuItem value={1}>France</MenuItem>
                  <MenuItem value={2}>Canada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <div>
                  Parent
                  <Radio
                    checked={selectedRole === 'parent'}
                    onChange={handleRole}
                    value="parent"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Parent' }}
                  />
                  Son
                  <Radio
                    checked={selectedRole === 'son'}
                    onChange={handleRole}
                    value="son"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Son' }}
                  />
                  Admin
                  <Radio
                    checked={selectedRole === 'admin'}
                    onChange={handleRole}
                    value="admin"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'Admin' }}
                  />
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

