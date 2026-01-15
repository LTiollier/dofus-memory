import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { theme } from './theme';
import { VideoSource } from '@/components/VideoSource';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dofus Memory Helper
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <VideoSource />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;