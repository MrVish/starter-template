import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename

class StorageService:
    """
    Abstract base storage service that handles file operations
    across different cloud providers and local storage
    """
    
    def __init__(self):
        self.provider = current_app.config.get('CLOUD_PROVIDER', 'local')
        
    def get_storage_provider(self):
        """Get the appropriate storage provider based on configuration"""
        if self.provider == 'aws':
            return S3StorageProvider()
        elif self.provider == 'gcp':
            return GCPStorageProvider()
        else:
            return LocalStorageProvider()
    
    def save_file(self, file, folder='uploads'):
        """Save a file to the configured storage provider"""
        provider = self.get_storage_provider()
        return provider.save(file, folder)
    
    def get_file_url(self, file_path):
        """Get the URL for a stored file"""
        provider = self.get_storage_provider()
        return provider.get_url(file_path)
    
    def delete_file(self, file_path):
        """Delete a file from storage"""
        provider = self.get_storage_provider()
        return provider.delete(file_path)


class LocalStorageProvider:
    """Provider for local file storage"""
    
    def save(self, file, folder='uploads'):
        """Save file to local filesystem"""
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        upload_folder = current_app.config.get('UPLOAD_FOLDER')
        folder_path = os.path.join(upload_folder, folder)
        
        # Create folder if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)
        
        file_path = os.path.join(folder_path, unique_filename)
        file.save(file_path)
        
        return os.path.join(folder, unique_filename)
    
    def get_url(self, file_path):
        """Get URL for local file (relative path)"""
        return f"/files/{file_path}"
    
    def delete(self, file_path):
        """Delete file from local filesystem"""
        upload_folder = current_app.config.get('UPLOAD_FOLDER')
        full_path = os.path.join(upload_folder, file_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False


class S3StorageProvider:
    """Provider for AWS S3 storage"""
    
    def __init__(self):
        # Import boto3 only when S3 provider is used
        try:
            import boto3
            self.s3 = boto3.client(
                's3',
                aws_access_key_id=current_app.config.get('AWS_ACCESS_KEY'),
                aws_secret_access_key=current_app.config.get('AWS_SECRET_KEY'),
                region_name=current_app.config.get('AWS_REGION')
            )
            self.bucket = current_app.config.get('AWS_S3_BUCKET')
        except ImportError:
            current_app.logger.error("boto3 is not installed. Install it with pip install boto3")
            self.s3 = None
    
    def save(self, file, folder='uploads'):
        """Save file to S3"""
        if not self.s3:
            return None
            
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        key = f"{folder}/{unique_filename}"
        
        self.s3.upload_fileobj(file, self.bucket, key)
        return key
    
    def get_url(self, file_path):
        """Get URL for S3 object"""
        if not self.s3:
            return None
            
        return f"https://{self.bucket}.s3.amazonaws.com/{file_path}"
    
    def delete(self, file_path):
        """Delete file from S3"""
        if not self.s3:
            return False
            
        self.s3.delete_object(Bucket=self.bucket, Key=file_path)
        return True


class GCPStorageProvider:
    """Provider for Google Cloud Storage"""
    
    def __init__(self):
        # Import google-cloud-storage only when GCP provider is used
        try:
            from google.cloud import storage
            self.storage_client = storage.Client(project=current_app.config.get('GCP_PROJECT_ID'))
            self.bucket = self.storage_client.bucket(current_app.config.get('GCP_BUCKET'))
        except ImportError:
            current_app.logger.error("google-cloud-storage is not installed. Install it with pip install google-cloud-storage")
            self.storage_client = None
    
    def save(self, file, folder='uploads'):
        """Save file to GCP Storage"""
        if not self.storage_client:
            return None
            
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        key = f"{folder}/{unique_filename}"
        
        blob = self.bucket.blob(key)
        blob.upload_from_file(file)
        return key
    
    def get_url(self, file_path):
        """Get URL for GCP Storage object"""
        if not self.storage_client:
            return None
            
        bucket_name = current_app.config.get('GCP_BUCKET')
        return f"https://storage.googleapis.com/{bucket_name}/{file_path}"
    
    def delete(self, file_path):
        """Delete file from GCP Storage"""
        if not self.storage_client:
            return False
            
        blob = self.bucket.blob(file_path)
        blob.delete()
        return True 