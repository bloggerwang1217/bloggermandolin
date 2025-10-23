import React from 'react';
import Layout from '@theme/Layout';
import NeurosynthSearch from '@site/src/components/NeurosynthSearch/NeurosynthSearch';

export default function NeurosynthSearchPage() {
  return (
    <Layout
      title="Neurosynth Search"
      description="[NTU Psychoinformatics and Neuroinformatics 114-1 Homework] Explore related neuroscience terms and studies via Neurosynth-style search interface.">
      <main>
        <NeurosynthSearch />
      </main>
    </Layout>
  );
}
