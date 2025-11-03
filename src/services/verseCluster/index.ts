

import { clusterCreationService } from './clusterCreation';
import { clusterRetrievalService } from './clusterRetrieval';
import { clusterDeletionService } from './clusterDeletion';
import { clusterOrderingService } from './clusterOrdering';

export * from './types';

class VerseClusterService {
  // Creation methods
  createVerseCluster = clusterCreationService.createVerseCluster.bind(clusterCreationService);

  // Retrieval methods
  getAllUserClusters = clusterRetrievalService.getAllUserClusters.bind(clusterRetrievalService);
  getChapterClusters = clusterRetrievalService.getChapterClusters.bind(clusterRetrievalService);
  getClusterVerseNumbers = clusterRetrievalService.getClusterVerseNumbers.bind(clusterRetrievalService);

  // Deletion methods
  deleteCluster = clusterDeletionService.deleteCluster.bind(clusterDeletionService);
  removeVerseFromCluster = clusterDeletionService.removeVerseFromCluster.bind(clusterDeletionService);
  removeMultipleVersesFromClusters = clusterDeletionService.removeMultipleVersesFromClusters.bind(clusterDeletionService);

  // Ordering methods
  updateClusterOrder = clusterOrderingService.updateClusterOrder.bind(clusterOrderingService);
}

export const verseClusterService = new VerseClusterService();
