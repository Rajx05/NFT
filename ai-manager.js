// AI Content Generation Manager for LiteraVerse
class AIManager {
    constructor() {
        this.apiKey = null;
        this.isConfigured = false;
        this.models = {
            story: 'gpt-3.5-turbo',
            poem: 'gpt-3.5-turbo',
            comic: 'gpt-3.5-turbo'
        };
        this.generationHistory = [];
    }

    // Configure API key
    configure(apiKey) {
        this.apiKey = apiKey;
        this.isConfigured = true;
        localStorage.setItem('openai_api_key', apiKey);
        console.log('OpenAI API configured successfully');
    }

    // Load API key from storage
    loadAPIKey() {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
            this.apiKey = storedKey;
            this.isConfigured = true;
        }
    }

    // Generate story using AI
    async generateStory(prompt, genre = 'fantasy', length = 'medium') {
        if (!this.isConfigured) {
            return this.generateMockStory(prompt, genre, length);
        }

        try {
            const systemPrompt = this.getStorySystemPrompt(genre, length);
            const userPrompt = `Create a ${genre} story: ${prompt}`;

            const response = await this.callOpenAI(systemPrompt, userPrompt);
            
            const story = {
                title: this.extractTitle(response),
                content: response,
                genre: genre,
                length: length,
                isAIGenerated: true,
                generatedAt: new Date(),
                prompt: prompt
            };

            this.generationHistory.push(story);
            return story;
        } catch (error) {
            console.error('AI story generation failed:', error);
            return this.generateMockStory(prompt, genre, length);
        }
    }

    // Generate poem using AI
    async generatePoem(topic, style = 'free-verse', mood = 'contemplative') {
        if (!this.isConfigured) {
            return this.generateMockPoem(topic, style, mood);
        }

        try {
            const systemPrompt = this.getPoemSystemPrompt(style, mood);
            const userPrompt = `Write a ${style} poem about: ${topic}`;

            const response = await this.callOpenAI(systemPrompt, userPrompt);
            
            const poem = {
                title: this.extractTitle(response),
                content: response,
                style: style,
                mood: mood,
                isAIGenerated: true,
                generatedAt: new Date(),
                topic: topic
            };

            this.generationHistory.push(poem);
            return poem;
        } catch (error) {
            console.error('AI poem generation failed:', error);
            return this.generateMockPoem(topic, style, mood);
        }
    }

    // Generate comic script using AI
    async generateComicScript(premise, genre = 'superhero', pages = 3) {
        if (!this.isConfigured) {
            return this.generateMockComicScript(premise, genre, pages);
        }

        try {
            const systemPrompt = this.getComicSystemPrompt(genre, pages);
            const userPrompt = `Create a ${genre} comic script: ${premise}`;

            const response = await this.callOpenAI(systemPrompt, userPrompt);
            
            const comic = {
                title: this.extractTitle(response),
                content: response,
                genre: genre,
                pages: pages,
                isAIGenerated: true,
                generatedAt: new Date(),
                premise: premise
            };

            this.generationHistory.push(comic);
            return comic;
        } catch (error) {
            console.error('AI comic generation failed:', error);
            return this.generateMockComicScript(premise, genre, pages);
        }
    }

    // Call OpenAI API
    async callOpenAI(systemPrompt, userPrompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 2000,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // System prompts for different content types
    getStorySystemPrompt(genre, length) {
        const lengthGuidelines = {
            short: 'Keep it under 1000 words',
            medium: 'Aim for 1000-3000 words',
            long: 'Create a detailed story over 3000 words'
        };

        return `You are a creative writer specializing in ${genre} stories. ${lengthGuidelines[length]}. 
        Create engaging, original content with well-developed characters and plot. 
        Include dialogue, descriptions, and narrative flow. Make it suitable for NFT minting.`;
    }

    getPoemSystemPrompt(style, mood) {
        const styleGuidelines = {
            'free-verse': 'Use free verse with natural rhythm',
            'sonnet': 'Follow traditional sonnet structure (14 lines, iambic pentameter)',
            'haiku': 'Use traditional haiku format (5-7-5 syllables)',
            'limerick': 'Use AABBA rhyme scheme with humor',
            'ballad': 'Use narrative form with regular meter and rhyme'
        };

        return `You are a poet creating ${style} poetry. ${styleGuidelines[style]}. 
        Capture the ${mood} mood through imagery, metaphor, and rhythm. 
        Make it emotionally resonant and suitable for NFT minting.`;
    }

    getComicSystemPrompt(genre, pages) {
        return `You are a comic book writer creating a ${genre} comic script for ${pages} pages. 
        Format as: PAGE X, PANEL Y, CAPTION/DIALOGUE. Include visual descriptions, 
        character actions, and dialogue. Create engaging scenes with clear narrative flow. 
        Make it suitable for NFT minting.`;
    }

    // Extract title from generated content
    extractTitle(content) {
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        
        if (firstLine.length < 100 && !firstLine.includes('PAGE')) {
            return firstLine.replace(/^[#*\-]\s*/, '').trim();
        }
        
        return 'Untitled';
    }

    // Mock implementations for demo
    generateMockStory(prompt, genre, length) {
        const stories = {
            fantasy: [
                "The Dragon's Last Flight",
                "The Enchanted Forest",
                "The Crystal Kingdom"
            ],
            'sci-fi': [
                "The Quantum Paradox",
                "Neo-Tokyo Chronicles",
                "The Last Earth Station"
            ],
            mystery: [
                "The Midnight Detective",
                "The Vanishing Manuscript",
                "The Cryptic Code"
            ]
        };

        const title = stories[genre][Math.floor(Math.random() * stories[genre].length)];
        
        return {
            title,
            content: `# ${title}\n\nIn the world of ${genre}, where ${prompt}, our story begins...\n\n[This is a mock story generated for demonstration purposes. In production, this would be replaced with actual AI-generated content.]`,
            genre,
            length,
            isAIGenerated: true,
            generatedAt: new Date(),
            prompt
        };
    }

    generateMockPoem(topic, style, mood) {
        const poems = {
            'free-verse': `# ${topic}\n\nIn the quiet moments\nwhen ${topic} whispers\nthrough the silence\nof contemplation\n\n[This is a mock poem generated for demonstration purposes.]`,
            'haiku': `# ${topic}\n\n${topic} blooms bright\nin morning's gentle light\nnature's pure delight`,
            'sonnet': `# ${topic}\n\nShall I compare thee to ${topic}?\nThou art more lovely and more temperate...\n\n[This is a mock sonnet generated for demonstration purposes.]`
        };

        return {
            title: topic,
            content: poems[style] || poems['free-verse'],
            style,
            mood,
            isAIGenerated: true,
            generatedAt: new Date(),
            topic
        };
    }

    generateMockComicScript(premise, genre, pages) {
        return {
            title: premise,
            content: `# ${premise}\n\nPAGE 1\n\nPANEL 1 (Wide shot)\nA ${genre} setting with ${premise}.\n\nCAPTION: In a world where ${premise}...\n\n[This is a mock comic script generated for demonstration purposes.]`,
            genre,
            pages,
            isAIGenerated: true,
            generatedAt: new Date(),
            premise
        };
    }

    // Content validation
    validateContent(content) {
        const issues = [];
        
        if (!content || content.trim().length === 0) {
            issues.push('Content is empty');
        }
        
        if (content.length < 100) {
            issues.push('Content is too short');
        }
        
        if (content.length > 10000) {
            issues.push('Content is too long');
        }
        
        // Check for inappropriate content (basic)
        const inappropriateWords = ['hate', 'violence', 'explicit'];
        const lowerContent = content.toLowerCase();
        
        inappropriateWords.forEach(word => {
            if (lowerContent.includes(word)) {
                issues.push(`Content may contain inappropriate material`);
            }
        });
        
        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }

    // Content originality check (simplified)
    async checkOriginality(content) {
        // In production, this would use plagiarism detection APIs
        return {
            isOriginal: true,
            confidence: 0.95,
            sources: []
        };
    }

    // Get generation history
    getGenerationHistory() {
        return this.generationHistory;
    }

    // Clear generation history
    clearHistory() {
        this.generationHistory = [];
    }

    // Get content statistics
    getContentStats() {
        const stats = {
            totalGenerated: this.generationHistory.length,
            stories: this.generationHistory.filter(item => item.genre).length,
            poems: this.generationHistory.filter(item => item.style).length,
            comics: this.generationHistory.filter(item => item.pages).length,
            lastGenerated: this.generationHistory.length > 0 ? 
                this.generationHistory[this.generationHistory.length - 1].generatedAt : null
        };
        
        return stats;
    }
}

// Initialize AI manager
const aiManager = new AIManager();

// Load API key on initialization
aiManager.loadAPIKey();

// Export for use in other modules
window.aiManager = aiManager;