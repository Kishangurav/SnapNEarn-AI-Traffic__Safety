/**
 * 🚨 Helmet Detection Service
 * Advanced AI-powered helmet detection and violation analysis
 */

const API_BASE_URL = 'http://localhost:5001';

class HelmetDetectionService {
  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  /**
   * Convert image URI to base64
   */
  async imageToBase64(imageUri) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      throw error;
    }
  }

  /**
   * Analyze single image for helmet detection
   */
  async analyzeImage(imageUri) {
    try {
      console.log('🔍 Starting helmet detection analysis...');
      
      const base64Image = await this.imageToBase64(imageUri);
      
      const response = await fetch(`${this.apiUrl}/detect/helmet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Helmet detection completed:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Helmet detection failed:', error);
      throw error;
    }
  }

  /**
   * Analyze video frames for violations
   */
  async analyzeVideo(frames) {
    try {
      console.log(`🎥 Starting video analysis with ${frames.length} frames...`);
      
      const response = await fetch(`${this.apiUrl}/detect/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frames: frames
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Video analysis completed:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Video analysis failed:', error);
      throw error;
    }
  }

  /**
   * Check service health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      const result = await response.json();
      return result.status === 'healthy';
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  /**
   * Get violation details
   */
  getViolationDetails(violationType) {
    const violations = {
      'no_helmet': {
        name: 'No Helmet',
        fine: 500,
        description: 'Riding without helmet',
        icon: '🪖',
        color: '#ef4444'
      },
      'triple_riding': {
        name: 'Triple Riding',
        fine: 1000,
        description: 'More than 2 people on vehicle',
        icon: '👥',
        color: '#f59e0b'
      },
      'red_light': {
        name: 'Red Light Violation',
        fine: 1000,
        description: 'Jumping red traffic light',
        icon: '🚦',
        color: '#dc2626'
      },
      'overspeeding': {
        name: 'Overspeeding',
        fine: 2000,
        description: 'Exceeding speed limit',
        icon: '⚡',
        color: '#8b5cf6'
      },
      'mobile_use': {
        name: 'Mobile Phone Use',
        fine: 1000,
        description: 'Using mobile while driving',
        icon: '📱',
        color: '#06b6d4'
      },
      'no_license': {
        name: 'No License',
        fine: 5000,
        description: 'Driving without valid license',
        icon: '📄',
        color: '#84cc16'
      }
    };

    return violations[violationType] || {
      name: 'Unknown Violation',
      fine: 500,
      description: 'Traffic violation',
      icon: '⚠️',
      color: '#6b7280'
    };
  }

  /**
   * Calculate total fine and reward
   */
  calculateFineAndReward(violations) {
    const totalFine = violations.reduce((sum, violation) => {
      const details = this.getViolationDetails(violation);
      return sum + details.fine;
    }, 0);

    const reward = Math.floor(totalFine * 0.1); // 10% reward

    return {
      totalFine,
      reward,
      violationCount: violations.length
    };
  }

  /**
   * Format analysis result for display
   */
  formatAnalysisResult(result) {
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Analysis failed',
        violations: [],
        totalFine: 0,
        reward: 0
      };
    }

    const violations = result.violations || [];
    const { totalFine, reward } = this.calculateFineAndReward(violations);

    return {
      success: true,
      violations,
      totalFine,
      reward,
      helmetDetection: result.helmet_detection,
      tripleRiding: result.triple_riding_detection,
      numberPlate: result.number_plate,
      timestamp: result.timestamp,
      confidence: this.calculateOverallConfidence(result)
    };
  }

  /**
   * Calculate overall confidence score
   */
  calculateOverallConfidence(result) {
    const confidences = [];
    
    if (result.helmet_detection?.confidence) {
      confidences.push(result.helmet_detection.confidence);
    }
    
    if (result.triple_riding_detection?.confidence) {
      confidences.push(result.triple_riding_detection.confidence);
    }
    
    if (result.number_plate?.confidence) {
      confidences.push(result.number_plate.confidence);
    }

    if (confidences.length === 0) return 0;
    
    const average = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    return Math.round(average * 100) / 100;
  }

  /**
   * Mock video frame extraction (for demo purposes)
   */
  async extractVideoFrames(videoUri, frameCount = 5) {
    try {
      // In a real implementation, this would extract actual frames from video
      // For now, we'll create mock frames
      const frames = [];
      
      for (let i = 0; i < frameCount; i++) {
        // Mock frame data - in real app, extract actual frames
        frames.push('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=');
      }
      
      return frames;
    } catch (error) {
      console.error('Failed to extract video frames:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new HelmetDetectionService();
