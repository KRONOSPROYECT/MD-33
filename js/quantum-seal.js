class QuantumSeal {
    constructor() {
        this.rootHash = 'KRONOS-MD-33-467162326';
        this.chain = [];
        this.numeros = [4, 6, 7, 16, 23, 26];
    }

    generateHash(data) {
        const str = JSON.stringify(data) + this.rootHash;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
            this.numeros.forEach(n => {
                hash = (hash * n) ^ (hash >> n);
            });
        }
        return 'MD33-' + Math.abs(hash).toString(16).padStart(32, '0').toUpperCase();
    }

    createSeal(folioData) {
        const timestamp = new Date().toISOString();
        const hash = this.generateHash({
            folio: folioData.id,
            timestamp: timestamp,
            previousHash: this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : this.rootHash,
            data: folioData
        });

        const seal = {
            folio: folioData.id,
            hash: hash,
            previousHash: this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : this.rootHash,
            timestamp: timestamp,
            rootSignature: this.rootHash,
            version: '1.0.0'
        };

        this.chain.push(seal);
        return seal;
    }

    verifyChain() {
        if (this.chain.length === 0) return { valid: true, message: 'Cadena vacía' };
        for (let i = 0; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = i > 0 ? this.chain[i - 1] : null;
            const expectedHash = this.generateHash({
                folio: current.folio,
                timestamp: current.timestamp,
                previousHash: previous ? previous.hash : this.rootHash,
                data: current.data || {}
            });
            if (current.hash !== expectedHash) {
                return { valid: false, brokenIndex: i };
            }
            if (previous && current.previousHash !== previous.hash) {
                return { valid: false, brokenIndex: i };
            }
        }
        return { valid: true, totalSeals: this.chain.length };
    }
}

window.QuantumSeal = QuantumSeal;