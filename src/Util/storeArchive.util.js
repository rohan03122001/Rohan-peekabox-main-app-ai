const Store = require('../models/Store/store.schema');
const ArchiveStore = require('../models/Store/archiveStore.schema');

const moveDeletedStoresToArchive = async () => {
  const session = await Store.startSession();
  try {
    session.startTransaction();
    const deletedRecords = await Store.find({ isDeleted: true }, null, {
      session,
    }).lean();

    if (!deletedRecords.length) {
      await session.abortTransaction();
      return {
        success: true,
        message: 'No deleted stores found to archive',
        count: 0,
      };
    }
    const recordsToArchive = deletedRecords.map((record) => ({
      ...record,
      archivedAt: new Date(),
    }));

    await ArchiveStore.insertMany(recordsToArchive, { session });
    await Store.deleteMany({ isDeleted: true }, { session });

    await session.commitTransaction();

    return {
      success: true,
      message: `Successfully archived ${deletedRecords.length} store records`,
      count: deletedRecords.length,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Store archiving failed:', error.message);
    return {
      success: false,
      message: `Failed to archive stores: ${error.message}`,
    };
  } finally {
    session.endSession();
  }
};

module.exports = { moveDeletedStoresToArchive };
