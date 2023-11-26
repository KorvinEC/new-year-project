import { Box } from '@mui/material';
import { AuthorizationForm } from '../../components/AuthorizationForm/AuthorizationForm';
import { PageContainer } from '../../shared/ui/PageContainer';

// Component definition
export function LoginPage() {
    return (
        <PageContainer>
            <Box
                display="flex"
                sx={{
                    width: '100%',
                    height: '100%',
                    dispaly: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box sx={{
                    maxWidth: '600px',
                    height: '500px',
                }}
                >
                    <AuthorizationForm />
                </Box>
            </Box>
        </PageContainer>
    );
}
