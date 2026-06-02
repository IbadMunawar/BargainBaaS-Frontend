import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DocumentationSlugRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the main unified documentation page
    router.replace('/dashboard/documentation');
  }, [router]);

  return null; // Render nothing while redirecting
};

export default DocumentationSlugRedirect;