import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DocumentationIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the Introduction page
    router.replace('/dashboard/documentation/introduction');
  }, [router]);

  return null; // Render nothing while redirecting
};

export default DocumentationIndex;