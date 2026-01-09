const BOUNDARY = 'foo_bar_baz';
const DELIMITER = `\r\n--${BOUNDARY}\r\n`;
const CLOSE_DELIM = `\r\n--${BOUNDARY}--`;

export const driveService = {
    async findFile(accessToken: string, fileName: string) {
        try {
            const q = encodeURIComponent(`name='${fileName}' and trashed=false`);
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id, name, createdTime)`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Find file failed: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Found files:', data.files);
            return data.files?.[0] || null;
        } catch (error) {
            console.error('Error finding file:', error);
            return null;
        }
    },

    async uploadFile(accessToken: string, content: any, fileName: string, fileId?: string) {
        const metadata = {
            name: fileName,
            mimeType: 'application/json',
        };

        const multipartRequestBody =
            DELIMITER +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            DELIMITER +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(content) +
            CLOSE_DELIM;

        const url = fileId
            ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
            : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

        const method = fileId ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': `multipart/related; boundary=${BOUNDARY}`,
                },
                body: multipartRequestBody,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${errorText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    async downloadFile(accessToken: string, fileId: string) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Download failed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    },
};
