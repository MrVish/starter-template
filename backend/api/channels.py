from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.dim_channels import DimChannel, ChannelType
from repositories.base_repository import BaseRepository
from sqlalchemy.exc import SQLAlchemyError

channels_bp = Blueprint('channels', __name__)
channel_repository = BaseRepository(DimChannel)

@channels_bp.route('/', methods=['GET'])
@jwt_required()
def get_channels():
    """Get all marketing channels"""
    try:
        channels = DimChannel.query.all()
        return jsonify({
            "success": True, 
            "data": [channel.to_dict() for channel in channels]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/<int:channel_id>', methods=['GET'])
@jwt_required()
def get_channel(channel_id):
    """Get a specific marketing channel by ID"""
    try:
        channel = DimChannel.query.get(channel_id)
        if not channel:
            return jsonify({"success": False, "message": "Channel not found"}), 404
            
        return jsonify({"success": True, "data": channel.to_dict()}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/', methods=['POST'])
@jwt_required()
def create_channel():
    """Create a new marketing channel"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['name', 'type']):
            return jsonify({
                "success": False, 
                "message": "Missing required fields: name, type"
            }), 400
            
        # Validate channel type
        try:
            channel_type = ChannelType[data['type']]
        except KeyError:
            return jsonify({
                "success": False, 
                "message": f"Invalid channel type. Must be one of: {', '.join([t.name for t in ChannelType])}"
            }), 400
            
        new_channel = DimChannel(
            name=data['name'],
            type=channel_type,
            description=data.get('description')
        )
        
        channel_repository.add(new_channel)
        channel_repository.commit()
        
        return jsonify({
            "success": True, 
            "message": "Channel created successfully", 
            "data": new_channel.to_dict()
        }), 201
    except SQLAlchemyError as e:
        channel_repository.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/<int:channel_id>', methods=['PUT'])
@jwt_required()
def update_channel(channel_id):
    """Update an existing marketing channel"""
    try:
        channel = DimChannel.query.get(channel_id)
        if not channel:
            return jsonify({"success": False, "message": "Channel not found"}), 404
            
        data = request.get_json()
        
        if 'name' in data:
            channel.name = data['name']
            
        if 'type' in data:
            try:
                channel.type = ChannelType[data['type']]
            except KeyError:
                return jsonify({
                    "success": False, 
                    "message": f"Invalid channel type. Must be one of: {', '.join([t.name for t in ChannelType])}"
                }), 400
                
        if 'description' in data:
            channel.description = data['description']
            
        channel_repository.commit()
        
        return jsonify({
            "success": True, 
            "message": "Channel updated successfully", 
            "data": channel.to_dict()
        }), 200
    except SQLAlchemyError as e:
        channel_repository.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/<int:channel_id>', methods=['DELETE'])
@jwt_required()
def delete_channel(channel_id):
    """Delete a marketing channel"""
    try:
        channel = DimChannel.query.get(channel_id)
        if not channel:
            return jsonify({"success": False, "message": "Channel not found"}), 404
            
        channel_repository.delete(channel)
        channel_repository.commit()
        
        return jsonify({
            "success": True, 
            "message": "Channel deleted successfully"
        }), 200
    except SQLAlchemyError as e:
        channel_repository.rollback()
        return jsonify({
            "success": False, 
            "message": f"Cannot delete channel: {str(e)}"
        }), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/types', methods=['GET'])
@jwt_required()
def get_channel_types():
    """Get all available channel types"""
    try:
        types = [{"name": t.name, "value": t.value} for t in ChannelType]
        return jsonify({"success": True, "data": types}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@channels_bp.route('/performance', methods=['GET'])
@jwt_required()
def get_channels_performance():
    """Get performance metrics for all channels"""
    try:
        # Get time period from query params with defaults
        from datetime import datetime, timedelta
        
        end_date = datetime.now()
        days = request.args.get('days', 30, type=int)
        start_date = end_date - timedelta(days=days)
        
        # Get channel performance from the database using raw SQL for complex aggregation
        from app import db
        
        sql = """
        SELECT 
            dc.id,
            dc.name,
            dc.type,
            COUNT(DISTINCT fp.campaign_id) as campaign_count,
            SUM(fp.impressions) as total_impressions,
            SUM(fp.clicks) as total_clicks,
            SUM(fp.conversions) as total_conversions,
            ROUND(SUM(fp.revenue)::numeric, 2) as total_revenue,
            ROUND(SUM(fp.cost)::numeric, 2) as total_cost,
            ROUND(SUM(fp.revenue - fp.cost)::numeric, 2) as total_profit,
            ROUND(CASE WHEN SUM(fp.impressions) > 0 THEN 
                SUM(fp.clicks)::float / SUM(fp.impressions) * 100 
                ELSE 0 END, 2) as ctr,
            ROUND(CASE WHEN SUM(fp.clicks) > 0 THEN 
                SUM(fp.conversions)::float / SUM(fp.clicks) * 100 
                ELSE 0 END, 2) as conversion_rate,
            ROUND(CASE WHEN SUM(fp.cost) > 0 THEN 
                SUM(fp.revenue)::float / SUM(fp.cost) 
                ELSE 0 END, 2) as roi
        FROM 
            dim_channel dc
        LEFT JOIN 
            fact_performance fp ON dc.id = fp.channel_id
        WHERE 
            fp.date BETWEEN :start_date AND :end_date
        GROUP BY 
            dc.id, dc.name, dc.type
        ORDER BY 
            total_profit DESC
        """
        
        result = db.session.execute(sql, {
            'start_date': start_date.date(),
            'end_date': end_date.date()
        })
        
        channels_performance = []
        for row in result:
            channels_performance.append({
                'id': row.id,
                'name': row.name,
                'type': row.type,
                'campaign_count': row.campaign_count,
                'impressions': row.total_impressions,
                'clicks': row.total_clicks,
                'conversions': row.total_conversions,
                'revenue': float(row.total_revenue),
                'cost': float(row.total_cost),
                'profit': float(row.total_profit),
                'ctr': float(row.ctr),
                'conversion_rate': float(row.conversion_rate),
                'roi': float(row.roi)
            })
        
        return jsonify({
            "success": True,
            "data": {
                "channels": channels_performance,
                "period": {
                    "start_date": start_date.date().isoformat(),
                    "end_date": end_date.date().isoformat(),
                    "days": days
                }
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500 